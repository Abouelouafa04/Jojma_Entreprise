import { DataTypes, Model, ForeignKey } from 'sequelize';
import { sequelize } from '../../config/database';
import { ContactRequest } from './contact.model';

class ContactResponse extends Model {
  public id!: string;
  public contactRequestId!: ForeignKey<ContactRequest['id']>;
  public adminName!: string;
  public response!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ContactResponse.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  contactRequestId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ContactRequest,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  adminName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 5000],
    },
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
  modelName: 'ContactResponse',
  tableName: 'contact_responses',
  timestamps: true,
  indexes: [
    {
      fields: ['contactRequestId'],
    },
    {
      fields: ['createdAt'],
    },
  ],
});

// Association avec ContactRequest
ContactRequest.hasMany(ContactResponse, {
  foreignKey: 'contactRequestId',
  as: 'responses',
  onDelete: 'CASCADE',
});

ContactResponse.belongsTo(ContactRequest, {
  foreignKey: 'contactRequestId',
  as: 'contactRequest',
});

export { ContactResponse };
