
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class Post extends Model {
  public postId!: number;
  public textContent!: string;
  public numberOfWords!: number; 
  public averageWordLength!: number;
  public status!: 'created' | 'enqueued' | 'processed';
}

Post.init(
  {
    postId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    textContent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfWords: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    averageWordLength: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('created', 'enqueued', 'processed'),
        allowNull: false,
        defaultValue: 'created',
    },
  },
  {
    sequelize,
    modelName: 'post',
  }
);

export default Post;
