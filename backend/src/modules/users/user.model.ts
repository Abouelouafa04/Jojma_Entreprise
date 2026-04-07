import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import bcrypt from 'bcrypt';

class User extends Model {
  public id!: string;
  public fullName!: string;
  public prenom?: string;
  public nom?: string;
  public email!: string;
  public password!: string;
  public accountType!: 'creator' | 'company' | 'studio' | 'agency';
  public phone?: string | null;
  public location?: string | null;
  public company?: string | null;
  public industry?: string | null;
  public jobTitle?: string | null;
  public profilePhotoUrl?: string | null;
  public isActive!: boolean;
  public emailVerified!: boolean;
  public role!: 'user' | 'admin';
  public termsAccepted!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountType: {
    type: DataTypes.ENUM('creator', 'company', 'studio', 'agency'),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhotoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  termsAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async (user: User) => {
      user.password = await bcrypt.hash(user.password, 12);
    }
  }
});

export default User;
