class BookingStatusSubject {
    constructor() {
      this.observers = [];
    }
  
    attach(observer) {
      this.observers.push(observer);
    }
  
    notify(data) {
      this.observers.forEach((observer) => observer.update(data));
    }
  }
  
  class BookingAuditLogObserver {
    update({ booking, oldStatus, newStatus }) {
      console.log(
        `[Booking Audit] Booking ${booking._id} status changed from ${oldStatus} to ${newStatus}`
      );
    }
  }
  
  class CustomerNotificationObserver {
    update({ booking, oldStatus, newStatus }) {
      const customerName = booking.user?.name || 'Customer';
  
      const messages = {
        confirmed: `Hi ${customerName}, your booking has been confirmed.`,
        completed: `Hi ${customerName}, your booking has been marked as completed.`,
        cancelled: `Hi ${customerName}, your booking has been cancelled.`,
        pending: `Hi ${customerName}, your booking is currently pending.`,
      };
  
      const message = messages[newStatus];
  
      if (message && oldStatus !== newStatus) {
        console.log(`[Customer Notification] ${message}`);
      }
    }
  }
  
  module.exports = {
    BookingStatusSubject,
    BookingAuditLogObserver,
    CustomerNotificationObserver,
  };