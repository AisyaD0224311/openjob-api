/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('documents', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    file_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    original_file_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    mime_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    file_size: {
      type: 'bigint',
      notNull: true,
    },
    file_path: {
      type: 'varchar(500)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('documents', 'user_id');
  pgm.createIndex('documents', 'created_at');
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
};
