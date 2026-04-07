import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Conversation from "./Conversation.js";

interface ConversationMessageAttributes {
  id: number;
  conversationId: number;
  role: "system" | "user" | "assistant";
  content: string;
  tokenCount?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConversationMessageCreationAttributes
  extends Optional<ConversationMessageAttributes, "id" | "tokenCount"> {}

class ConversationMessage
  extends Model<ConversationMessageAttributes, ConversationMessageCreationAttributes>
  implements ConversationMessageAttributes
{
  public id!: number;
  public conversationId!: number;
  public role!: "system" | "user" | "assistant";
  public content!: string;
  public tokenCount!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConversationMessage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "conversations",
        key: "id",
      },
    },
    role: {
      type: DataTypes.ENUM("system", "user", "assistant"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    tokenCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "conversation_messages",
    modelName: "ConversationMessage",
  }
);

Conversation.hasMany(ConversationMessage, {
  foreignKey: "conversationId",
  as: "messages",
  onDelete: "CASCADE",
});

ConversationMessage.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

export default ConversationMessage;