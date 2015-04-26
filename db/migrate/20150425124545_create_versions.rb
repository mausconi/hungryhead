class CreateVersions < ActiveRecord::Migration
  def change
    create_table :versions do |t|
      t.string   :item_type, :null => false
      t.integer  :item_id,   :null => false
      t.string   :event,     :null => false
      t.string   :whodunnit
      t.string :user_name
      t.string :user_avatar
      t.string :owner_url
      t.json :object_changes
      t.json     :object
      t.datetime :created_at
    end
    add_index :versions, [:item_type, :item_id]
  end
end