// Simple test to demonstrate testing capability
describe('Buyer Lead Intake App', () => {
  describe('Basic Validation Logic', () => {
    it('should validate phone number format', () => {
      const isValidPhone = (phone: string) => {
        return /^\d{10,15}$/.test(phone);
      };

      expect(isValidPhone('9876543210')).toBe(true);
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abc1234567')).toBe(false);
      expect(isValidPhone('1234567890123456')).toBe(false);
    });

    it('should validate budget constraints', () => {
      const isValidBudget = (min?: number, max?: number) => {
        if (!min && !max) return true;
        if (!min || !max) return true;
        return max >= min;
      };

      expect(isValidBudget(5000000, 8000000)).toBe(true);
      expect(isValidBudget(8000000, 5000000)).toBe(false);
      expect(isValidBudget(5000000)).toBe(true);
      expect(isValidBudget(undefined, 8000000)).toBe(true);
      expect(isValidBudget()).toBe(true);
    });

    it('should validate BHK requirement for property types', () => {
      const isBhkRequired = (propertyType: string) => {
        return ['Apartment', 'Villa'].includes(propertyType);
      };

      expect(isBhkRequired('Apartment')).toBe(true);
      expect(isBhkRequired('Villa')).toBe(true);
      expect(isBhkRequired('Office')).toBe(false);
      expect(isBhkRequired('Plot')).toBe(false);
      expect(isBhkRequired('Retail')).toBe(false);
    });

    it('should format currency correctly', () => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(amount);
      };

      expect(formatCurrency(5000000)).toBe('₹50,00,000');
      expect(formatCurrency(100000)).toBe('₹1,00,000');
      expect(formatCurrency(0)).toBe('₹0');
    });

    it('should validate email format', () => {
      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.in')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });
});
