const organizationchartSchema = new Schema({
    manager: { type: Schema.Types.ObjectId, ref: 'employee' },
    employees: [{ type: Schema.Types.ObjectId, ref: 'employee' }]
  });
  
 
  const OrganizationChart = mongoose.model('organizationChart', organizationchartSchema);
  
  module.exports = OrganizationChart;