// Server-only Mongoose model for system settings
let mongoose: any = null
let Schema: any = null

if (typeof window === 'undefined') {
  try {
    const mongooseModule = require('mongoose')
    mongoose = mongooseModule.default || mongooseModule
    Schema = mongoose.Schema
  } catch (error) {
    console.log('Mongoose not available in this environment')
  }
}

// Define schema only on server-side
let SystemSettingSchema: any = null

if (typeof window === 'undefined' && mongoose && Schema) {
  SystemSettingSchema = new Schema(
    {
      settings: {
        type: Schema.Types.Mixed,
        required: true,
      },
    },
    {
      timestamps: true,
      collection: 'system_settings',
    }
  )
}

// Create model only on server-side
let SystemSettingModel: any = null

if (typeof window === 'undefined' && mongoose) {
  try {
    SystemSettingModel = mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema)
  } catch (error) {
    console.log('Error creating SystemSetting model:', error)
  }
}

export default SystemSettingModel