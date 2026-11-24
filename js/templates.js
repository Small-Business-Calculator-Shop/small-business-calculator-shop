'use strict';
window.ToolkitTemplates={
 maker:{name:'Products & Manufacturing',unit:'item',prompt:'What are you making?',categories:['Ingredients / materials','Packaging','Labor','Delivery','Equipment','Waste','Overhead']},
 food:{name:'Food & Restaurants',unit:'serving',prompt:'What food or drink are you preparing?',categories:['Ingredients','Containers / packaging','Kitchen labor','Spoilage / waste','Delivery','Kitchen overhead']},
 services:{name:'Services',unit:'appointment',prompt:'What service do you provide?',categories:['Supplies','Travel','Service labor','Preparation / cleanup','Booking fees','Overhead']},
 professional:{name:'Professional Services',unit:'project',prompt:'What client work are you costing?',categories:['Billable labor','Nonbillable preparation','Software / research','Travel','Subcontractors','Overhead']},
 trades:{name:'Construction & Trades',unit:'job',prompt:'What job are you quoting?',categories:['Materials','Site labor','Subcontractors','Equipment rental','Travel','Waste','Overhead']},
 retail:{name:'Retail & Reselling',unit:'item',prompt:'What are you reselling?',categories:['Inventory purchase','Inbound freight','Import duties','Packaging','Marketplace fees','Returns allowance','Overhead']},
 education:{name:'Education & Training',unit:'participant',prompt:'What class or course are you offering?',categories:['Preparation','Instructor labor','Materials','Venue','Platform fees','Administration','Overhead']},
 custom:{name:'My Own Business Type',unit:'sale',prompt:'What are you costing?',categories:['Materials','Labor','Other costs']}
};
window.ToolkitTemplateFor=(id,custom)=>{const base=window.ToolkitTemplates[id]||window.ToolkitTemplates.maker;return {...base,categories:[...new Set([...(base.categories||[]),...(custom||[])])]}};
