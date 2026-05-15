// Separates the booking status rules from the booking controller using strategy

class PendingBookingStrategy {
    canUserUpdate() {
        return true;
    }

    canUserCancel() {
        return true;
    }
}

class ConfirmedBookingStrategy {
    canUserUpdate() {
        return false;
    }

    canUserCancel() {
        return false;
    }
}

class CompletedBookingStrategy {
    canUserUpdate() {
        return false;
    }

    canUserCancel() {
        return false;
    }
}

class CancelledBookingStrategy {
    canUserUpdate() {
        return false;
    }

    canUserCancel() {
        return false;
    }
}

class BookingStatusContext {
    constructor(status) {
        this.strategy = this.getStrategy(status);
    }

    getStrategy(status) {
        switch (status) {
            case 'pending':
                return new PendingBookingStrategy();
            case 'confirmed':
                return new ConfirmedBookingStrategy();
            case 'completed':
                return new CompletedBookingStrategy();
            case 'cancelled':
                return new CancelledBookingStrategy();
            default:
                throw new Error ('Invalid booking status');
        }
    }

    canUserUpdate() {
        return this.strategy.canUserUpdate();
    }

    canUserCancel() {
        return this.strategy.canUserCancel();
    }
}

module.exports = BookingStatusContext;