import SubscriptionPlan from '../modules/users/plan.model';
import User from '../modules/users/user.model';
import EmailVerificationToken from '../modules/users/emailVerificationToken.model';
import { ContactRequest } from '../modules/contact/contact.model';

// Define associations
EmailVerificationToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(EmailVerificationToken, {
  foreignKey: 'userId',
  as: 'emailVerificationTokens'
});

export const seedDatabase = async () => {
  try {
    const plansCount = await SubscriptionPlan.count();
    if (plansCount === 0) {
      await SubscriptionPlan.bulkCreate([
        { name: 'Free', maxConversions: 10, maxStorageMb: 100 },
        { name: 'Pro', maxConversions: 100, maxStorageMb: 1000 },
        { name: 'Enterprise', maxConversions: 1000, maxStorageMb: 10000 },
      ]);
      console.log('🌱 Database seeded with initial plans.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
