import express, { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { verifyPassword, createAdminToken, verifyAdminToken } from './auth';
import {
  notifyNewOrder,
  notifyPaymentSubmitted,
  notifyOrderStatusChanged,
  sendTestNotification,
  getEmailConfigStatus,
} from './email';
import { OrderType, PaymentMethod } from './types';

export function createApiRouter(): express.Router {
  const router = express.Router();
  router.use(express.json({ limit: '10mb' }));

  // ============================================
  // PUBLIC ROUTES
  // ============================================

  // 1. Settings (Public view)
  router.get('/settings', (req: Request, res: Response) => {
    const s = db.getSettings();
    res.json({
      siteName: s.siteName,
      whatsapp: s.whatsapp,
      bkash: s.bkash,
      nagad: s.nagad,
      rocket: s.rocket,
      adsMinimumBudget: s.adsMinimumBudget,
      adsServiceFee: s.adsServiceFee,
      smmServiceFee: s.smmServiceFee,
      usdConversionRate: s.usdConversionRate,
      deliveryMessages: s.deliveryMessages,
      dollarCategory: s.dollarCategory,
      announcementBar: s.announcementBar,
      maintenanceMode: s.maintenanceMode || {
        enabled: false,
        message: 'আমরা বর্তমানে কিছু গুরুত্বপূর্ণ আপডেট করছি। খুব শীঘ্রই BOOSTARA আবার সম্পূর্ণভাবে চালু হবে।',
        estimatedReturn: '',
      },
    });
  });

  // 2. Real Trust Stats (Completed orders count directly from database)
  router.get('/trust-stats', (req: Request, res: Response) => {
    const count = db.getCompletedOrdersCount();
    res.json({
      completedOrdersCount: count,
    });
  });

  // 3. SMM Services & Active Tiers
  router.get('/smm-services', (req: Request, res: Response) => {
    const services = db.getSMMServices(true);
    res.json(services);
  });

  // 3b. Website Packages (Public view: active only)
  router.get('/website-packages', (req: Request, res: Response) => {
    const packages = db.getWebsitePackages(false);
    res.json(packages);
  });

  // 4. Create Guest Order
  router.post('/orders', async (req: Request, res: Response) => {
    try {
      const { type, customerWhatsapp, orderNote, smm, ads, website } = req.body;

      if (!type || !['SMM', 'ADS', 'WEBSITE'].includes(type)) {
        res.status(400).json({ error: 'অবৈধ অর্ডার টাইপ।' });
        return;
      }

      if (!customerWhatsapp || customerWhatsapp.trim().length < 10) {
        res.status(400).json({ error: 'সঠিক WhatsApp বা ফোন নাম্বার দিন।' });
        return;
      }

      const settings = db.getSettings();
      let totalAmount = 0;
      let advanceAmount: number | undefined;
      let remainingAmount: number | undefined;
      let smmDetails: any = undefined;
      let adsDetails: any = undefined;
      let websiteDetails: any = undefined;

      // A. SMM Order Validation & Snapshotting
      if (type === 'SMM') {
        const { platform, serviceType, tierName, ratePer1000, quantity, targetLink, reactionType } = smm || {};

        if (!platform || !serviceType || !tierName || !ratePer1000 || !quantity || !targetLink) {
          res.status(400).json({ error: 'SMM অর্ডারের সকল প্রয়োজনীয় তথ্য পূরণ করুন।' });
          return;
        }

        // Required Reaction Type for Facebook Reactions
        if (platform === 'Facebook' && serviceType === 'Reactions') {
          const validReactions = ['Like', 'Love', 'Care', 'Haha', 'Sad', 'Angry'];
          if (!reactionType || !validReactions.includes(reactionType)) {
            res.status(400).json({
              error: 'ফেসবুক রিঅ্যাকশনের জন্য একটি রিঅ্যাকশন টাইপ (Like, Love, Care, Haha, Sad বা Angry) নির্বাচন করা আবশ্যক।',
            });
            return;
          }
        }

        const qty = Number(quantity);
        const rate = Number(ratePer1000);

        if ((serviceType === 'Followers' || serviceType === 'Subscribers') && qty < 500) {
          res.status(400).json({ error: 'ফলোয়ার বা সাবস্ক্রাইবারের জন্য ন্যূনতম পরিমাণ ৫০০ হতে হবে।' });
          return;
        }

        const calculated = Math.round((qty / 1000) * rate);
        if (calculated < 20) {
          res.status(400).json({ error: 'সর্বনিম্ন অর্ডারের মূল্য ২০ টাকা হতে হবে।' });
          return;
        }

        totalAmount = calculated + (settings.smmServiceFee || 0);

        smmDetails = {
          platform,
          serviceType,
          tierName,
          ratePer1000: rate,
          quantity: qty,
          targetLink: targetLink.trim(),
          smmServiceFee: settings.smmServiceFee || 0,
          reactionType: platform === 'Facebook' && serviceType === 'Reactions' ? reactionType : undefined,
        };
      }

      // B. Ads Boost Order Validation
      else if (type === 'ADS') {
        const {
          platform,
          targetLink,
          adObjective,
          targetAgeRange,
          gender,
          location,
          interests,
          targetAudience,
          adFormat,
          budget,
          campaignDuration,
          mediaLink,
        } = ads || {};

        if (!platform || !targetLink || !budget || !campaignDuration || !mediaLink) {
          res.status(400).json({ error: 'অ্যাড বুস্ট অর্ডারের সকল তথ্য এবং মিডিয়া লিংক পূরণ করুন।' });
          return;
        }

        const b = Number(budget);
        if (b < settings.adsMinimumBudget) {
          res.status(400).json({ error: `সর্বনিম্ন অ্যাড বাজেট ৳${settings.adsMinimumBudget} হতে হবে।` });
          return;
        }

        totalAmount = b + settings.adsServiceFee;

        adsDetails = {
          platform,
          targetLink: targetLink.trim(),
          adObjective,
          targetAgeRange,
          gender,
          location,
          interests,
          targetAudience,
          adFormat,
          budget: b,
          campaignDuration,
          mediaLink: mediaLink.trim(),
          serviceFee: settings.adsServiceFee,
        };
      }

      // C. Dynamic Website Building Order Validation
      else if (type === 'WEBSITE') {
        const { packageId, businessName, websiteType, preferredColor, referenceLink, deliveryMethod } = website || {};

        if (!packageId) {
          res.status(400).json({ error: 'একটি বৈধ ওয়েবসাইট প্যাকেজ নির্বাচন করুন।' });
          return;
        }

        // Support both dynamic ID and legacy aliases ('package_1' -> 'pkg_built_for_you', 'package_2' -> 'pkg_learn_yourself')
        let targetId = packageId;
        if (targetId === 'package_1') targetId = 'pkg_built_for_you';
        if (targetId === 'package_2') targetId = 'pkg_learn_yourself';

        let pkg = db.getWebsitePackageById(targetId);
        // Fallback: If not found by ID, try finding by matching index/name
        if (!pkg && (packageId === 'package_1' || packageId === 'package_2')) {
          const allPkgs = db.getWebsitePackages(true);
          pkg = packageId === 'package_1' ? allPkgs[0] : allPkgs[1];
        }

        if (!pkg) {
          res.status(400).json({ error: 'নির্বাচিত ওয়েবসাইট প্যাকেজটি পাওয়া যায়নি।' });
          return;
        }

        if (!pkg.active) {
          res.status(400).json({ error: 'এই ওয়েবসাইট প্যাকেজটি বর্তমানে সক্রিয় নেই। অন্য প্যাকেজ নির্বাচন করুন।' });
          return;
        }

        // Snapshot prices at the exact time of order!
        totalAmount = Number(pkg.totalPrice) || 0;
        advanceAmount = Number(pkg.advanceAmount) || 0;
        remainingAmount = Number(pkg.remainingAmount) !== undefined ? Number(pkg.remainingAmount) : (totalAmount - advanceAmount);

        websiteDetails = {
          packageId: pkg.id,
          packageName: pkg.name,
          totalPrice: totalAmount,
          advanceAmount,
          remainingAmount,
          deliveryTime: pkg.deliveryTime,
          businessName: businessName?.trim() || undefined,
          websiteType: websiteType?.trim() || undefined,
          preferredColor: preferredColor?.trim() || undefined,
          referenceLink: referenceLink?.trim() || undefined,
          deliveryMethod: deliveryMethod || undefined,
        };
      }

      const createdOrder = db.createOrder({
        type: type as OrderType,
        customerWhatsapp: customerWhatsapp.trim(),
        orderStatus: 'Pending',
        paymentStatus: 'Pending',
        orderNote: orderNote?.trim() || '',
        totalAmount,
        advanceAmount,
        remainingAmount,
        smmDetails,
        adsDetails,
        websiteDetails,
      });

      // Email Notification
      notifyNewOrder(createdOrder, settings.adminNotificationEmail).catch(console.error);

      res.status(201).json({
        success: true,
        orderId: createdOrder.orderId,
        id: createdOrder.id,
        totalAmount: createdOrder.totalAmount,
        advanceAmount: createdOrder.advanceAmount,
      });
    } catch (err: any) {
      console.error('Order creation error:', err);
      res.status(500).json({ error: 'অর্ডার তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' });
    }
  });

  // 5. Get Order for Payment Verification Page
  router.get('/orders/:orderId', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: 'অর্ডার পাওয়া যায়নি।' });
      return;
    }

    // Return sanitized order data for guest payment screen
    res.json({
      orderId: order.orderId,
      type: order.type,
      totalAmount: order.totalAmount,
      advanceAmount: order.advanceAmount,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      customerWhatsapp: order.customerWhatsapp,
      payment: order.payment,
      details: order.smmDetails || order.adsDetails || order.websiteDetails,
    });
  });

  // 6. Submit Payment
  router.post('/payments', async (req: Request, res: Response) => {
    try {
      const { orderId, paymentMethod, senderNumber, transactionId, paidAmount } = req.body;

      if (!orderId || !paymentMethod || !senderNumber || !transactionId || !paidAmount) {
        res.status(400).json({ error: 'পেমেন্টের সকল তথ্য দিন।' });
        return;
      }

      if (!['bKash', 'Nagad', 'Rocket'].includes(paymentMethod)) {
        res.status(400).json({ error: 'সঠিক পেমেন্ট মেথড নির্বাচন করুন।' });
        return;
      }

      const order = db.getOrderById(orderId);
      if (!order) {
        res.status(404).json({ error: 'নির্দিষ্ট অর্ডার আইডি পাওয়া যায়নি।' });
        return;
      }

      const payment = db.addPayment({
        orderId: order.orderId,
        paymentMethod: paymentMethod as PaymentMethod,
        senderNumber: senderNumber.trim(),
        transactionId: transactionId.trim().toUpperCase(),
        paidAmount: Number(paidAmount),
        paymentStatus: 'Pending',
      });

      if (!payment) {
        res.status(500).json({ error: 'পেমেন্ট সংরক্ষণ ব্যর্থ হয়েছে।' });
        return;
      }

      // Email Notification
      const settings = db.getSettings();
      notifyPaymentSubmitted(order, payment, settings.adminNotificationEmail).catch(console.error);

      res.status(201).json({
        success: true,
        message: 'পেমেন্ট সফলভাবে জমা হয়েছে।',
        payment,
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      res.status(500).json({ error: 'পেমেন্ট প্রক্রিয়াকরণে সমস্যা হয়েছে।' });
    }
  });

  // 7. Order Tracking
  router.post('/orders/track', (req: Request, res: Response) => {
    const { orderId, customerWhatsapp } = req.body;

    if (!orderId || !customerWhatsapp) {
      res.status(400).json({ error: 'Order ID এবং ফোন নাম্বার দুটিই প্রয়োজন।' });
      return;
    }

    const order = db.findOrderByTrack(orderId, customerWhatsapp);

    if (!order) {
      // Must match exact specification:
      res.status(404).json({
        error: 'অর্ডার পাওয়া যায়নি। Order ID এবং ফোন নাম্বারটি সঠিক কিনা যাচাই করুন।',
      });
      return;
    }

    res.json({
      orderId: order.orderId,
      type: order.type,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      rejectionReason: order.rejectionReason,
      totalAmount: order.totalAmount,
      advanceAmount: order.advanceAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      payment: order.payment ? {
        paymentMethod: order.payment.paymentMethod,
        senderNumber: order.payment.senderNumber,
        transactionId: order.payment.transactionId,
        paidAmount: order.payment.paidAmount,
        paymentStatus: order.payment.paymentStatus,
        submittedAt: order.payment.submittedAt,
      } : null,
      serviceDetails: order.smmDetails || order.adsDetails || order.websiteDetails,
    });
  });

  // 8. Public Reviews (Only visible == true)
  router.get('/reviews', (req: Request, res: Response) => {
    const reviews = db.getReviews(true);
    res.json(reviews);
  });

  // ============================================
  // ADMIN AUTH & MANAGEMENT ROUTES
  // ============================================

  // Admin Login
  router.post('/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'ইমেল এবং পাসওয়ার্ড দিন।' });
      return;
    }

    const admin = db.getAdminByEmail(email);
    if (!admin) {
      res.status(401).json({ error: 'ভুল ইমেল বা পাসওয়ার্ড।' });
      return;
    }

    const isMatch = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isMatch) {
      res.status(401).json({ error: 'ভুল ইমেল বা পাসওয়ার্ড।' });
      return;
    }

    const token = createAdminToken(admin.id, admin.email);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  });

  // Admin Auth Middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'অ্যাক্সেস অনুমোদিত নয়। অ্যাডমিন লগইন প্রয়োজন।' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAdminToken(token);

    if (!payload || payload.role !== 'admin') {
      res.status(403).json({ error: 'অবৈধ অথবা মেয়াদোত্তীর্ণ টোকেন।' });
      return;
    }

    (req as any).admin = payload;
    next();
  };

  // Check Admin Current Auth
  router.get('/admin/me', requireAdmin, (req: Request, res: Response) => {
    const adminPayload = (req as any).admin;
    res.json({ admin: adminPayload });
  });

  // Admin Analytics
  router.get('/admin/analytics', requireAdmin, (req: Request, res: Response) => {
    const analytics = db.getAnalytics();
    res.json(analytics);
  });

  // Admin Orders List
  router.get('/admin/orders', requireAdmin, (req: Request, res: Response) => {
    const { type, orderStatus, paymentStatus, search, page = '1', limit = '50' } = req.query;

    let orders = db.getOrders();

    if (type && type !== 'ALL') {
      orders = orders.filter((o) => o.type === type);
    }
    if (orderStatus && orderStatus !== 'ALL') {
      orders = orders.filter((o) => o.orderStatus === orderStatus);
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      orders = orders.filter((o) => o.paymentStatus === paymentStatus);
    }
    if (search) {
      const q = String(search).toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customerWhatsapp.includes(q) ||
          (o.payment && o.payment.transactionId.toLowerCase().includes(q))
      );
    }

    // Pagination
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const total = orders.length;
    const start = (pageNum - 1) * limitNum;
    const paged = orders.slice(start, start + limitNum);

    res.json({
      orders: paged,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  });

  // Update Order Status / Rejection Reason
  router.patch('/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { orderStatus, paymentStatus, rejectionReason } = req.body;
    const previousOrder = db.getOrderById(req.params.id);
    const updated = db.updateOrderStatus(req.params.id, {
      orderStatus,
      paymentStatus,
      rejectionReason,
    });

    if (!updated) {
      res.status(404).json({ error: 'অর্ডার পাওয়া যায়নি।' });
      return;
    }

    // Trigger email notification if status changed
    if (
      previousOrder &&
      (previousOrder.orderStatus !== updated.orderStatus || previousOrder.paymentStatus !== updated.paymentStatus)
    ) {
      const settings = db.getSettings();
      notifyOrderStatusChanged(updated, previousOrder.orderStatus, settings.adminNotificationEmail).catch((err) => {
        console.error('Failed to dispatch status change notification email:', err);
      });
    }

    res.json({ success: true, order: updated });
  });

  // Admin SMM Services Management
  router.get('/admin/smm-services', requireAdmin, (req: Request, res: Response) => {
    const services = db.getSMMServices(false);
    res.json(services);
  });

  router.post('/admin/smm-services', requireAdmin, (req: Request, res: Response) => {
    const { platform, serviceType, minQuantity, maxQuantity, minOrderPrice, active, badge, tiers } = req.body;
    if (!platform || !serviceType) {
      res.status(400).json({ error: 'প্ল্যাটফর্ম এবং সার্ভিস টাইপ আবশ্যক।' });
      return;
    }

    const created = db.addSMMService({
      platform,
      serviceType,
      minQuantity: minQuantity || 100,
      maxQuantity: maxQuantity || 100000,
      minOrderPrice: minOrderPrice || 20,
      active: active !== undefined ? active : true,
      badge: badge || 'Normal',
      tiers: tiers || [],
    });

    res.status(201).json(created);
  });

  router.put('/admin/smm-services/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = db.updateSMMService(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'সার্ভিস পাওয়া যায়নি।' });
      return;
    }
    res.json(updated);
  });

  router.patch('/admin/smm-services/:id/badge', requireAdmin, (req: Request, res: Response) => {
    const { badge } = req.body;
    if (!['Featured', 'Popular', 'Normal'].includes(badge)) {
      res.status(400).json({ error: 'অবৈধ ব্যাজ নির্বাচন।' });
      return;
    }
    const updated = db.updateSMMService(req.params.id, { badge });
    if (!updated) {
      res.status(404).json({ error: 'সার্ভিস পাওয়া যায়নি।' });
      return;
    }
    res.json({ success: true, service: updated });
  });

  router.delete('/admin/smm-services/:id', requireAdmin, (req: Request, res: Response) => {
    const deleted = db.deleteSMMService(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'সার্ভিস মোছা যায়নি।' });
      return;
    }
    res.json({ success: true });
  });

  // Tier Management
  router.post('/admin/smm-services/:id/tiers', requireAdmin, (req: Request, res: Response) => {
    const { tierName, ratePer1000, guaranteePeriod, active } = req.body;
    if (!tierName || ratePer1000 === undefined) {
      res.status(400).json({ error: 'টিয়ার নাম এবং রেট দিন।' });
      return;
    }

    const newTier = db.addTier(req.params.id, {
      tierName,
      ratePer1000: Number(ratePer1000),
      guaranteePeriod: guaranteePeriod || 'গ্যারান্টি নেই',
      active: active !== undefined ? active : true,
    });

    if (!newTier) {
      res.status(404).json({ error: 'সার্ভিস পাওয়া যায়নি।' });
      return;
    }

    res.status(201).json(newTier);
  });

  router.put('/admin/smm-services/:serviceId/tiers/:tierId', requireAdmin, (req: Request, res: Response) => {
    const updated = db.updateTier(req.params.serviceId, req.params.tierId, req.body);
    if (!updated) {
      res.status(404).json({ error: 'টিয়ার পাওয়া যায়নি।' });
      return;
    }
    res.json(updated);
  });

  router.delete('/admin/smm-services/:serviceId/tiers/:tierId', requireAdmin, (req: Request, res: Response) => {
    const deleted = db.deleteTier(req.params.serviceId, req.params.tierId);
    if (!deleted) {
      res.status(404).json({ error: 'টিয়ার মোছা যায়নি।' });
      return;
    }
    res.json({ success: true });
  });

  // Admin Reviews Management
  router.get('/admin/reviews', requireAdmin, (req: Request, res: Response) => {
    const reviews = db.getReviews(false);
    res.json(reviews);
  });

  router.post('/admin/reviews', requireAdmin, (req: Request, res: Response) => {
    const { customerName, reviewText, rating, screenshot, visible } = req.body;
    if (!customerName || !reviewText) {
      res.status(400).json({ error: 'গ্রাহকের নাম ও রিভিউ টেক্সট দিন।' });
      return;
    }

    const created = db.addReview({
      customerName,
      reviewText,
      rating: Number(rating) || 5,
      screenshot: screenshot || '',
      visible: visible !== undefined ? visible : true,
    });

    res.status(201).json(created);
  });

  router.put('/admin/reviews/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = db.updateReview(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'রিভিউ পাওয়া যায়নি।' });
      return;
    }
    res.json(updated);
  });

  router.delete('/admin/reviews/:id', requireAdmin, (req: Request, res: Response) => {
    const deleted = db.deleteReview(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'রিভিউ মোছা যায়নি।' });
      return;
    }
    res.json({ success: true });
  });

  // Admin Settings Management
  router.get('/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const settings = db.getSettings();
    res.json(settings);
  });

  router.put('/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // ==========================================
  // Admin Website Packages Management
  // ==========================================
  router.get('/admin/website-packages', requireAdmin, (req: Request, res: Response) => {
    const packages = db.getWebsitePackages(true);
    res.json(packages);
  });

  router.post('/admin/website-packages', requireAdmin, (req: Request, res: Response) => {
    const { name, totalPrice, advanceAmount, remainingAmount, description, deliveryTime, sortOrder, active, packageType, features } = req.body;
    if (!name || String(name).trim() === '') {
      res.status(400).json({ error: 'প্যাকেজের নাম দিন।' });
      return;
    }

    const price = Number(totalPrice);
    if (isNaN(price) || price < 0) {
      res.status(400).json({ error: 'সঠিক মোট মূল্য দিন।' });
      return;
    }

    const advance = Number(advanceAmount);
    if (isNaN(advance) || advance < 0) {
      res.status(400).json({ error: 'সঠিক অগ্রিম ফি দিন।' });
      return;
    }

    const remaining = remainingAmount !== undefined ? Number(remainingAmount) : (price - advance);

    const created = db.addWebsitePackage({
      name: String(name).trim(),
      totalPrice: price,
      advanceAmount: advance,
      remainingAmount: remaining,
      description: description ? String(description).trim() : '',
      deliveryTime: deliveryTime ? String(deliveryTime).trim() : '১ থেকে ১০ ঘণ্টা',
      sortOrder: Number(sortOrder) || 1,
      active: active !== undefined ? Boolean(active) : true,
      packageType: packageType || 'custom_build',
      features: Array.isArray(features) ? features : [],
    });

    res.status(201).json(created);
  });

  router.put('/admin/website-packages/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = db.updateWebsitePackage(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'প্যাকেজটি পাওয়া যায়নি।' });
      return;
    }
    res.json(updated);
  });

  router.patch('/admin/website-packages/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const toggled = db.toggleWebsitePackageActive(req.params.id);
    if (!toggled) {
      res.status(404).json({ error: 'প্যাকেজটি পাওয়া যায়নি।' });
      return;
    }
    res.json(toggled);
  });

  router.delete('/admin/website-packages/:id', requireAdmin, (req: Request, res: Response) => {
    const deleted = db.deleteWebsitePackage(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'প্যাকেজটি মোছা যায়নি।' });
      return;
    }
    res.json({ success: true });
  });

  // CSV Export
  router.get('/admin/export-csv', requireAdmin, (req: Request, res: Response) => {
    const range = (req.query.range as any) || 'all';
    const csvData = db.exportOrdersCsv(range);

    const filename = `boostara_orders_${range}_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csvData); // include UTF-8 BOM for Excel Bengali character compatibility
  });

  // Admin Email Notification Diagnostics & Testing
  router.get('/admin/email-status', requireAdmin, (req: Request, res: Response) => {
    const settings = db.getSettings();
    const status = getEmailConfigStatus(settings.adminNotificationEmail);
    res.json(status);
  });

  router.post('/admin/test-email', requireAdmin, async (req: Request, res: Response) => {
    try {
      const settings = db.getSettings();
      const targetEmail = req.body.targetEmail || settings.adminNotificationEmail;
      const result = await sendTestNotification(targetEmail);
      res.json(result);
    } catch (err: any) {
      console.error('Test email failure:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}
