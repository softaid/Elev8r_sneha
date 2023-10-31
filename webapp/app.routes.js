
let appRouters = function (env, app, Container) {

    let container = new Container();

    // container.register('environment', { env: env });
    // container.register('bcrypt', require('bcryptjs'));
    // container.register('jwt', require('jsonwebtoken'));
    // container.register('nconf', require('nconf'));
    // container.register('config', require('./config.js'), ['nconf', 'environment']);
    
    // container.register('pool', require('./util/mysql.repository'), ['config']);
    
    container.register('environment', { env: env });
    container.register('bcrypt', require('bcryptjs'));
    container.register('jwt', require('jsonwebtoken'));
    container.register('nconf', require('nconf'));
    container.register('devconfig', require('./config/development'));
    container.register('prodconfig', require('./config/production'));
    container.register('config', require('./config.js'), ['nconf', 'environment']);
    container.register('pool', require('./util/mysql.repository'), ['devconfig', 'prodconfig', 'environment']);
    container.register('crypto', require('crypto'));
    
    container.register('logRepository', require('./util/log.repository'), ['pool']);
    container.register('oauthRepository', require('./api/auth/oauth.repository'), ['jwt', 'logRepository']);
    container.register('userRepository', require('./api/repositories/accounts/user.repository'), ['pool', 'logRepository']);
    container.register('loginRepository', require('./api/repositories/login.repository'), ['pool', 'logRepository']);
    container.register('manageuserRepository', require('./api/repositories/company/manageuser.repository'), ['pool', 'logRepository' ]);
    container.register('managesubscriptionRepository', require('./api/repositories/company/managesubscription.repository'), ['pool', 'logRepository' ]);
    container.register('manageentityRepository', require('./api/repositories/application/manageentity.repository'), ['pool', 'logRepository' ]);
    container.register('roleaccessRepository', require('./api/repositories/application/rolepermissions.repository'), ['pool', 'logRepository' ]);
    container.register('rolepermissionsRepository', require('./api/repositories/application/roleaccess.repository'), ['pool', 'logRepository' ]);
    container.register('managepermissionRepository', require('./api/repositories/application/managepermission.repository'), ['pool', 'logRepository' ]);
    container.register('warehouseRepository', require('./api/repositories/common/warehouse.repository'), ['pool', 'logRepository' ]);
    container.register('warehousebinRepository', require('./api/repositories/common/warehousebin.repository'), ['pool', 'logRepository' ]);
    container.register('commonRepository', require('./api/repositories/common.repository'), ['pool', 'logRepository' ]);

    //material movement
    container.register('materialmovementRepository', require('./api/repositories/common/materialmovement.repository'), ['pool', 'logRepository' ]);    


    // common repositories
    container.register('materialtransferRepository', require('./api/repositories/common/materialtransfer.repository'), ['pool', 'logRepository' ]);    
    container.register('materialtransferdetailsRepository', require('./api/repositories/common/materialtransferdetails.repository'), ['pool', 'logRepository' ]);     
    container.register('materialissueRepository', require('./api/repositories/common/materialissue.repository'), ['pool', 'logRepository' ]);    
    
    // end common repositories
    container.register('materialrequestRepository', require('./api/repositories/common/materialrequest.repository'), ['pool', 'logRepository' ]);        
    container.register('materialrequestdetailRepository', require('./api/repositories/common/materialrequestdetail.repository'), ['pool', 'logRepository' ]);        
    container.register('materialreceiptRepository', require('./api/repositories/common/materialreceipt.repository'), ['pool', 'logRepository' ]);        
    container.register('materialreceiptdetailRepository', require('./api/repositories/common/materialreceiptdetail.repository'), ['pool', 'logRepository' ]);    
    container.register('materialissueRepository', require('./api/repositories/common/materialissue.repository'), ['pool', 'logRepository' ]);        
    container.register('materialissuedetailRepository', require('./api/repositories/common/materialissuedetail.repository'), ['pool', 'logRepository' ]);            
    container.register('grpoRepository', require('./api/repositories/common/grpo.repository'), ['pool', 'logRepository' ]);            
    container.register('grpoDetailRepository', require('./api/repositories/common/grpodetails.repository'), ['pool', 'logRepository' ]);            
    container.register('itemRepository', require('./api/repositories/common/item.repository'), ['pool', 'logRepository' ]);            
    container.register('itemgroupRepository', require('./api/repositories/common/itemgroup.repository'), ['pool', 'logRepository' ]);            
    container.register('itemhsnRepository', require('./api/repositories/common/itemhsn.repository'), ['pool', 'logRepository' ]);            
    
    // end common repositories
    container.register('commonbranchRepository', require('./api/repositories/common/commonbranch.repository'), ['pool', 'logRepository' ]);
    container.register('commonbranchlineRepository', require('./api/repositories/common/commonbranchline.repository'), ['pool', 'logRepository' ]);
    container.register('employeeRepository', require('./api/repositories/common/employee.repository'), ['pool', 'logRepository' ]);
    container.register('factormasterRepository', require('./api/repositories/common/factormaster.repository'), ['pool', 'logRepository' ]);

    container.register('applicationsettingsRepository', require('./api/repositories/applicationsettings.repository'), ['pool', 'logRepository' ]);
    container.register('financialyearsettingRepository', require('./api/repositories/financialyearsetting.repository'), ['pool', 'logRepository' ]);
    container.register('financialyeardocseriesRepository', require('./api/repositories/financialyeardocseries.repository'), ['pool', 'logRepository' ]);
    container.register('notificationsettingRepository', require('./api/repositories/application/notificationsetting.repository'), ['pool', 'logRepository' ]);

        // Common DashBoard Repository
    container.register('commondashboardRepository', require('./api/repositories/dashboard/commondashboard.repository'), ['pool', 'logRepository' ]);


    container.register('leadmasterRepository', require('./api/repositories/leadmanagement/leadmaster.repository'), ['pool', 'logRepository' ]);
    container.register('leadRepository', require('./api/repositories/leadmanagement/lead.repository'), ['pool', 'logRepository' ]);
    container.register('leadactivityRepository', require('./api/repositories/leadmanagement/leadactivity.repository'), ['pool', 'logRepository' ]);
    container.register('projectactivityRepository', require('./api/repositories/projectmanagement/projectactivity.repository'), ['pool', 'logRepository' ]);
    container.register('projecttrackingRepository', require('./api/repositories/projectmanagement/projecttracking.repository'), ['pool', 'logRepository' ]);
    container.register('contactRepository', require('./api/repositories/leadmanagement/contact.repository'), ['pool', 'logRepository' ]);
    container.register('elocationRepository', require('./api/repositories/leadmanagement/elocation.repository'), ['pool', 'logRepository' ]);
    container.register('quotationRepository', require('./api/repositories/leadmanagement/quotation.repository'), ['pool', 'logRepository' ]);
    container.register('orderRepository', require('./api/repositories/leadmanagement/order.repository'), ['pool', 'logRepository' ]);
    container.register('elevProjectRepository', require('./api/repositories/projectmanagement/project.repository'), ['pool', 'logRepository' ]);
    container.register('departmentRepository', require('./api/repositories/projectmanagement/department.repository'), ['pool', 'logRepository' ]);
    container.register('subcontractorRepository', require('./api/repositories/projectmanagement/subcontractor.repository'), ['pool', 'logRepository' ]);
    container.register('attributelistRepository', require('./api/repositories/projectmanagement/attributelist.repository'), ['pool', 'logRepository' ]);

    
    //Services
    container.register('loginService', require('./api/services/login.service'), ['loginRepository', 'bcrypt', 'jwt', 'logRepository']);
    container.register('userService', require('./api/services/accounts/user.service'), ['userRepository','bcrypt', 'oauthRepository', 'logRepository']);    
    container.register('manageuserService', require('./api/services/company/manageuser.service'), ['manageuserRepository', 'oauthRepository', 'logRepository' ]);
    container.register('managesubscriptionService', require('./api/services/company/managesubscription.service'), ['managesubscriptionRepository', 'oauthRepository', 'logRepository' ]);
    container.register('manageentityService', require('./api/services/application/manageentity.service'), ['manageentityRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('managepermissionService', require('./api/services/application/managepermission.service'), ['managepermissionRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('roleaccessService', require('./api/services/application/roleaccess.service'), ['roleaccessRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('rolepermissionsService', require('./api/services/application/rolepermissions.service'), ['rolepermissionsRepository', 'oauthRepository', 'logRepository' ]);    
    
    container.register('warehouseService', require('./api/services/common/warehouse.service'), ['warehouseRepository', 'oauthRepository', 'logRepository' ]);
    container.register('warehousebinService', require('./api/services/common/warehousebin.service'), ['warehousebinRepository', 'oauthRepository', 'logRepository' ]);
        container.register('commonService', require('./api/services/common.service'), ['commonRepository', 'oauthRepository', 'logRepository', 'devconfig' ]); 
     // material movement
    container.register('materialmovementService', require('./api/services/common/materialmovement.service'), ['materialmovementRepository', 'oauthRepository', 'logRepository', 'devconfig' ]);    
    // common service 
    container.register('materialtransferService', require('./api/services/common/materialtransfer.service'), ['materialtransferRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('materialissueService', require('./api/services/common/materialissue.service'), ['materialissueRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('materialtransferdetailsService', require('./api/services/common/materialtransferdetails.service'), ['materialtransferdetailsRepository', 'oauthRepository', 'logRepository' ]);    
    
    
    container.register('materialrequestService', require('./api/services/common/materialrequest.service'), ['materialrequestRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('materialrequestdetailService',require('./api/services/common/materialrequestdetail.service'), ['materialrequestdetailRepository', 'oauthRepository', 'logRepository' ]);
    container.register('materialreceiptService', require('./api/services/common/materialreceipt.service'), ['materialreceiptRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('materialreceiptdetailService',require('./api/services/common/materialreceiptdetail.service'), ['materialreceiptdetailRepository', 'oauthRepository', 'logRepository' ]);
    container.register('materialissueService', require('./api/services/common/materialissue.service'), ['materialissueRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('materialissuedetailService',require('./api/services/common/materialissuedetail.service'), ['materialissuedetailRepository', 'oauthRepository', 'logRepository' ]);

    container.register('grpoService', require('./api/services/common/grpo.service'), ['grpoRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('grpoDetailService', require('./api/services/common/grpodetail.service'), ['grpoDetailRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('itemService', require('./api/services/common/item.service'), ['itemRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('itemGroupService', require('./api/services/common/itemgroup.service'), ['itemgroupRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('itemHSNService', require('./api/services/common/itemhsn.service'), ['itemhsnRepository', 'oauthRepository', 'logRepository' ]);    

    // end common services
     
     container.register('commonbranchService', require('./api/services/common/commonbranch.service'), ['commonbranchRepository', 'oauthRepository', 'logRepository' ]);    
     container.register('commonbranchlineService', require('./api/services/common/commonbranchline.service'), ['commonbranchlineRepository', 'oauthRepository', 'logRepository' ]);    
     container.register('employeeService', require('./api/services/common/employee.service'), ['employeeRepository', 'oauthRepository', 'logRepository' ]);
     container.register('factormasterService', require('./api/services/common/factormaster.service'), ['factormasterRepository', 'oauthRepository', 'logRepository' ]);    
    container.register('applicationsettingsService', require('./api/services/applicationsettings.service'), ['applicationsettingsRepository', 'oauthRepository', 'logRepository' ]);
    container.register('financialyearsettingService', require('./api/services/financialyearsetting.service'), ['financialyearsettingRepository', 'oauthRepository', 'logRepository' ]);
    container.register('financialyeardocseriesService', require('./api/services/financialyeardocseries.service'), ['financialyeardocseriesRepository', 'oauthRepository', 'logRepository' ]);
    container.register('notificationsettingService', require('./api/services/application/notificationsetting.service'), ['notificationsettingRepository', 'oauthRepository', 'logRepository' ]);    

    // common dash board services
    container.register('commondashboardService', require('./api/services/dashboard/commondashboard.service'), ['commondashboardRepository', 'oauthRepository', 'logRepository' ]);
     
    container.register('leadmasterService', require('./api/services/leadmanagement/leadmaster.service'), ['leadmasterRepository', 'oauthRepository', 'logRepository' ]);
    container.register('leadService', require('./api/services/leadmanagement/lead.service'), ['leadRepository', 'oauthRepository', 'logRepository' ]);
    container.register('leadactivityService', require('./api/services/leadmanagement/leadactivity.service'), ['leadactivityRepository', 'oauthRepository', 'logRepository' ]);
    container.register('projectactivityService', require('./api/services/projectmanagement/projectactivity.service'), ['projectactivityRepository', 'oauthRepository', 'logRepository' ]);  
    container.register('projecttrackingService', require('./api/services/projectmanagement/projecttracking.service'), ['projecttrackingRepository', 'oauthRepository', 'logRepository' ]);  
    container.register('contactService', require('./api/services/leadmanagement/contact.service'), ['contactRepository', 'oauthRepository', 'logRepository' ]);
    container.register('elocationService', require('./api/services/leadmanagement/elocation.service'), ['elocationRepository', 'oauthRepository', 'logRepository' ]);
    container.register('quotationService', require('./api/services/leadmanagement/quotation.service'), ['quotationRepository', 'oauthRepository', 'logRepository' ]);
    container.register('orderService', require('./api/services/leadmanagement/order.service'), ['orderRepository', 'oauthRepository', 'logRepository' ]);
    container.register('departmentService', require('./api/services/projectmanagement/department.service'), ['departmentRepository', 'oauthRepository', 'logRepository' ]);
    container.register('elevProjectService', require('./api/services/projectmanagement/project.service'), ['elevProjectRepository', 'oauthRepository', 'logRepository' ]);
    container.register('subcontractorService', require('./api/services/projectmanagement/subcontractor.service'), ['subcontractorRepository', 'oauthRepository', 'logRepository' ]);
    container.register('attributelistService', require('./api/services/projectmanagement/attributelist.service'), ['attributelistRepository', 'oauthRepository', 'logRepository' ]);

    // Routes
    let loginService = container.get('loginService');
    app.use('/login', loginService);
    
    let userService = container.get('userService');
    app.use('/user', userService);
    
    let manageUserService = container.get('manageuserService');
    app.use('/manageuser', manageUserService);

    let managesubscriptionService = container.get('managesubscriptionService');
    app.use('/managesubscription', managesubscriptionService);

    let manageentityService = container.get('manageentityService');
    app.use('/manageentity', manageentityService);

    let managepermissionService = container.get('managepermissionService');
    app.use('/managepermission', managepermissionService);

    let roleaccessService = container.get('roleaccessService');
    app.use('/roleaccess', roleaccessService);

    let rolepermissionsService = container.get('rolepermissionsService');
    app.use('/rolepermissions', rolepermissionsService);
    
    var warehouseService = container.get('warehouseService');
    app.use('/warehouse', warehouseService);
    
    var warehousebinService = container.get('warehousebinService');
    app.use('/warehousebin', warehousebinService);
        
    var commonService = container.get('commonService');
    app.use('/common', commonService);

    var materialmovementService = container.get('materialmovementService');
    app.use('/materialmovement', materialmovementService);


    var materialrequestService = container.get('materialrequestService');
    app.use('/materialrequest', materialrequestService);

    var materialrequestdetailService = container.get('materialrequestdetailService');
    app.use('/materialrequestdetail', materialrequestdetailService);

    var materialreceiptService = container.get('materialreceiptService');
    app.use('/materialreceipt', materialreceiptService);

    var materialreceiptdetailService = container.get('materialreceiptdetailService');
    app.use('/materialreceiptdetail', materialreceiptdetailService);

    var materialissueService = container.get('materialissueService');
    app.use('/materialissue', materialissueService);

    var materialissuedetailService = container.get('materialissuedetailService');
    app.use('/materialissuedetail', materialissuedetailService);

    var materialtransferService = container.get('materialtransferService');
    app.use('/materialtransfer', materialtransferService);

    var materialtransferdetailsService = container.get('materialtransferdetailsService');
    app.use('/materialtransferdetails', materialtransferdetailsService);

    var grpoService = container.get('grpoService');
    app.use('/grpo', grpoService);

    var grpoDetailService = container.get('grpoDetailService');
    app.use('/grpoDetail', grpoDetailService);

    var itemService = container.get('itemService');
    app.use('/item', itemService);

    var itemGroupService = container.get('itemGroupService');
    app.use('/itemgroup', itemGroupService);

    var itemHSNService = container.get('itemHSNService');
    app.use('/itemhsn', itemHSNService);

    var applicationsettingsService = container.get('applicationsettingsService');
    app.use('/applicationsettings', applicationsettingsService);

    var financialyearsettingService = container.get('financialyearsettingService');
    app.use('/financialyearsetting', financialyearsettingService);

    var financialyeardocseriesService = container.get('financialyeardocseriesService');
    app.use('/financialyeardocseries', financialyeardocseriesService);

    var notificationsettingService = container.get('notificationsettingService');
    app.use('/notificationsetting', notificationsettingService);
    
    var commondashboardService = container.get('commondashboardService');
    app.use('/commondashboard', commondashboardService);

    var leadmasterService = container.get('leadmasterService');
    app.use('/leadmaster', leadmasterService);

    var projectactivityService = container.get('projectactivityService');
    app.use('/projectactivity', projectactivityService);

    var projecttrackingService = container.get('projecttrackingService');
    app.use('/projecttracking', projecttrackingService);

    var leadService = container.get('leadService');
    app.use('/lead', leadService);

    var leadactivityService = container.get('leadactivityService');
    app.use('/leadactivity', leadactivityService);

    var contactService = container.get('contactService');
    app.use('/contact', contactService);

    var elocationService = container.get('elocationService');
    app.use('/elocation', elocationService);

    var quotationService = container.get('quotationService');
    app.use('/quotation', quotationService);

    var orderService = container.get('orderService');
    app.use('/order', orderService);

    var departmentService = container.get('departmentService');
    app.use('/department', departmentService);

    var elevProjectService= container.get('elevProjectService');
    app.use('/elevproject', elevProjectService);

    var subcontractorService = container.get('subcontractorService');
    app.use('/subcontractor', subcontractorService);

    var attributelistService = container.get('attributelistService');
    app.use('/attributelist', attributelistService);


    var employeeService = container.get('employeeService');
    app.use('/employee', employeeService);


}

module.exports = appRouters;
