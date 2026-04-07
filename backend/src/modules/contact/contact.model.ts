import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

class ContactRequest extends Model {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public message!: string;
  public subscribeNewsletter!: boolean;
  public status!: 'pending' | 'read' | 'responded';
  public requestNumber!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ContactRequest.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000],
    },
  },
  subscribeNewsletter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'read', 'responded'),
    defaultValue: 'pending',
  },
  requestNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'ContactRequest',
  tableName: 'contact_requests',
  timestamps: true,
  indexes: [
    {
      fields: ['email'],
    },
    {
      fields: ['requestNumber'],
    },
    {
      fields: ['createdAt'],
    },
  ],
});

export { ContactRequest };
