SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `SARAS LAYER FEED STD` (
  `id` int(11) DEFAULT NULL,
  `layerfeedstandardid` int(11) DEFAULT NULL,
  `weeknumber` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `feedconsumed` int(11) DEFAULT NULL,
  `cumulativefeed` int(11) DEFAULT NULL,
  `weeklybodyweight` int(11) DEFAULT NULL,
  `weeklygain` int(11) DEFAULT NULL,
  `phaseid` text,
  `companyid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `account_tds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `ledgerid` int(11) NOT NULL,
  `rate` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `accounts_dimension` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dimensioncode` varchar(100) DEFAULT NULL,
  `dimensionname` varchar(150) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `isactive` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `accounts_itemopeningbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postingdate` date DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `openingbalance` decimal(20,3) DEFAULT NULL,
  `unitprice` decimal(12,6) DEFAULT NULL,
  `total` decimal(30,6) DEFAULT NULL,
  `ledgerid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `additionalincentive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coststructureid` int(11) NOT NULL,
  `fromsellingrate` decimal(9,3) NOT NULL,
  `tosellingrate` decimal(9,3) NOT NULL,
  `incentive` decimal(9,3) NOT NULL,
  `maxincentive` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `amortization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amortizationdate` date NOT NULL,
  `breederbatchid` int(11) NOT NULL,
  `femalelivequantity` int(11) NOT NULL,
  `malelivequantity` int(11) NOT NULL,
  `ageinweeks` int(11) NOT NULL,
  `ageindays` int(11) DEFAULT NULL,
  `wipvalue` decimal(20,3) NOT NULL,
  `requiredbirdprice` decimal(20,3) NOT NULL,
  `requiredbirdvalue` decimal(20,3) NOT NULL,
  `eggsprediction` int(11) NOT NULL,
  `totaleggs` int(11) NOT NULL,
  `amortizationvalueofbird` decimal(20,3) DEFAULT NULL,
  `amortizationno` varchar(200) DEFAULT NULL,
  `birdcost` decimal(20,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `applicationsettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partywithmultipleroles` smallint(4) DEFAULT NULL,
  `showdisplayprefix` smallint(4) DEFAULT NULL,
  `recordsperpage` int(11) DEFAULT NULL,
  `pdcreminder` int(11) DEFAULT NULL,
  `creditperiodreminder` int(11) DEFAULT NULL,
  `financialyearstartday` int(11) DEFAULT NULL,
  `financialyearstartmonth` int(11) DEFAULT NULL,
  `datedisplayformat` varchar(50) DEFAULT NULL,
  `stocknamefields` varchar(500) DEFAULT NULL,
  `requisitionapproval` smallint(4) DEFAULT NULL,
  `poapproval` smallint(4) DEFAULT NULL,
  `showmrpandassessment` smallint(4) DEFAULT NULL,
  `purchaseenquiryprefix` varchar(50) DEFAULT NULL,
  `purchaseorderprefix` varchar(50) DEFAULT NULL,
  `purchasereturnprefix` varchar(50) DEFAULT NULL,
  `quotationapproval` smallint(4) DEFAULT NULL,
  `billapproval` smallint(4) DEFAULT NULL,
  `proformainvoiceapproval` smallint(4) DEFAULT NULL,
  `saleschallanapproval` smallint(4) DEFAULT NULL,
  `salesquotationprefix` varchar(50) DEFAULT NULL,
  `saleschallanprefix` varchar(50) DEFAULT NULL,
  `salesbillprefix` varchar(50) DEFAULT NULL,
  `servicebillprefix` varchar(50) DEFAULT NULL,
  `proformainvoiceprefix` varchar(50) DEFAULT NULL,
  `batchoutorder` varchar(50) DEFAULT NULL,
  `calculatetaxbeforediscount` smallint(4) DEFAULT NULL,
  `receiptvoucherapproval` smallint(4) DEFAULT NULL,
  `paymentvoucherapproval` smallint(4) DEFAULT NULL,
  `contravoucherapproval` smallint(4) DEFAULT NULL,
  `journalvoucherapproval` smallint(4) DEFAULT NULL,
  `receiptvoucherprefix` varchar(50) DEFAULT NULL,
  `smtpserver` varchar(50) DEFAULT NULL,
  `portno` varchar(15) DEFAULT NULL,
  `host` varchar(100) DEFAULT NULL,
  `emailid` varchar(100) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `emailretrycount` int(11) DEFAULT NULL,
  `requiredssl` smallint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `apptransaction` (
  `id` int(11) NOT NULL,
  `moduleid` int(11) NOT NULL,
  `transactioncode` varchar(100) NOT NULL,
  `transactionname` varchar(200) NOT NULL,
  `productid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `bank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bankname` varchar(200) NOT NULL,
  `microcode` varchar(200) DEFAULT NULL,
  `ifsccode` varchar(200) DEFAULT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `phoneno` varchar(50) DEFAULT NULL,
  `inactiveinyear` varchar(45) DEFAULT NULL,
  `accounttypeid` int(11) DEFAULT NULL,
  `accountledgerid` int(11) DEFAULT NULL,
  `accountno` varchar(50) DEFAULT NULL,
  `relationshipmanager` varchar(150) DEFAULT NULL,
  `managercontactno` varchar(100) DEFAULT NULL,
  `isdeleted` tinyint(4) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `batchdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchid` int(11) DEFAULT NULL,
  `currentbatchdate` date DEFAULT NULL,
  `phaseid` int(11) DEFAULT NULL,
  `ageindays` int(11) DEFAULT NULL,
  `batchplacementdate` date DEFAULT NULL,
  `firstdaydate` date DEFAULT NULL,
  `batchstatusid` int(11) DEFAULT NULL,
  `expectedphaseid` int(11) DEFAULT NULL,
  `birdcost` decimal(9,3) DEFAULT NULL,
  `maleitemid` int(11) DEFAULT NULL,
  `maleplacedquantity` int(11) DEFAULT NULL,
  `malelivequantity` int(11) DEFAULT NULL,
  `malemortality` int(11) DEFAULT NULL,
  `maleculls` int(11) DEFAULT NULL,
  `malesalequantity` int(11) DEFAULT NULL,
  `femaleitemid` int(11) DEFAULT NULL,
  `femaleplacedquantity` int(11) DEFAULT NULL,
  `femalelivequantity` int(11) DEFAULT NULL,
  `femalemortality` int(11) DEFAULT NULL,
  `femaleculls` int(11) DEFAULT NULL,
  `femalesalequanity` int(11) DEFAULT NULL,
  `totaleggscollection` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `livebatchdate` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `branch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchname` varchar(200) DEFAULT NULL,
  `branchcode` varchar(200) DEFAULT NULL,
  `isactive` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breeder_birdsalesorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stdsalesorderid` int(11) DEFAULT NULL,
  `partyid` int(11) DEFAULT NULL,
  `locationid` int(11) DEFAULT NULL,
  `moduleid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `totalsalesweight` decimal(15,3) DEFAULT NULL,
  `rateperkg` decimal(8,3) DEFAULT NULL,
  `fromweight` decimal(15,3) DEFAULT NULL,
  `toweight` decimal(15,3) DEFAULT NULL,
  `orderdate` date DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breeder_birdsalesorderdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbirdsalesorderid` int(11) NOT NULL,
  `batchid` int(11) NOT NULL,
  `batchsaleweight` decimal(15,3) NOT NULL,
  `pendingweight` decimal(15,3) NOT NULL,
  `itemid` int(11) NOT NULL,
  `shedid` int(11) DEFAULT NULL,
  `avgweight` decimal(15,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breeder_biredcost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) NOT NULL,
  `issueqty` decimal(20,3) NOT NULL,
  `transactiondate` date NOT NULL,
  `unitcost` decimal(30,6) DEFAULT NULL,
  `itemvalue` decimal(30,6) DEFAULT NULL,
  `itembatch` varchar(200) DEFAULT NULL,
  `breederbatchid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `transactionid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breeder_lifting_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `moduleid` int(11) DEFAULT NULL,
  `locationid` int(11) DEFAULT NULL,
  `scheduledate` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breeder_lifting_schedule_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `liftingscheduleid` int(11) DEFAULT NULL,
  `breederbirdsalesorderid` int(11) DEFAULT NULL,
  `batchid` int(11) DEFAULT NULL,
  `batchweight` decimal(15,3) DEFAULT NULL,
  `plannedweight` decimal(15,3) DEFAULT NULL,
  `approvedweight` decimal(15,3) DEFAULT NULL,
  `batchcost` decimal(15,3) DEFAULT NULL,
  `linesupervisorid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breeder_liftingweight` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `liftingscheduleid` int(11) DEFAULT NULL,
  `breederbirdsalesorderid` int(11) DEFAULT NULL,
  `stdsalesorderid` int(11) DEFAULT NULL,
  `liftingdate` date DEFAULT NULL,
  `totaldeliveredqty` int(11) DEFAULT NULL,
  `totaldeliveredwt` decimal(12,3) DEFAULT NULL,
  `totaldeliverycost` decimal(12,3) DEFAULT NULL,
  `excessbirds` int(11) DEFAULT NULL,
  `birdshortage` int(11) DEFAULT NULL,
  `islastdelivery` tinyint(4) DEFAULT NULL,
  `stddeliveryid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `batchid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breeder_liftingweightdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederliftingweightid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `plannedqty` int(11) DEFAULT NULL,
  `deliveredqty` int(11) DEFAULT NULL,
  `plannedwt` decimal(15,3) DEFAULT NULL,
  `deliveredwt` decimal(15,3) DEFAULT NULL,
  `liftingtime` varchar(45) DEFAULT NULL,
  `rateperkg` decimal(9,3) DEFAULT NULL,
  `totalcost` decimal(20,3) DEFAULT NULL,
  `excessbirds` int(11) DEFAULT NULL,
  `birdshortage` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breeder_uniformity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` varchar(200) NOT NULL,
  `date` date DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breeder_uniformitydetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uniformityid` int(11) DEFAULT NULL,
  `fromweeks` smallint(6) NOT NULL,
  `toweeks` smallint(6) NOT NULL,
  `percent` decimal(8,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederbatch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) NOT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `batchname` varchar(100) NOT NULL,
  `binid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `isNewFinancialYear` tinyint(4) DEFAULT NULL,
  `maleitemid` int(11) DEFAULT NULL,
  `femaleitemid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederbatchbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `updateddate` date DEFAULT NULL,
  `breederbatchid` int(11) DEFAULT NULL,
  `breedershedid` int(11) DEFAULT NULL,
  `breedershedpenid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `transactionname` varchar(45) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederbatchconsumptionopeningdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchopeningid` int(11) DEFAULT NULL,
  `breeditemid` int(11) DEFAULT NULL,
  `consumptiontypeid` int(11) DEFAULT NULL,
  `consumptionitemid` int(11) DEFAULT NULL,
  `quantity` decimal(20,3) DEFAULT NULL,
  `rate` decimal(9,3) DEFAULT NULL,
  `itemvalue` decimal(20,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breederbatchfinancialopeningdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchopeningid` int(11) DEFAULT NULL,
  `breedervalue` decimal(20,3) DEFAULT NULL,
  `consumptionvalue` decimal(20,3) DEFAULT NULL,
  `overheadexp` decimal(9,3) DEFAULT NULL,
  `breedliveqty` decimal(20,6) DEFAULT NULL,
  `WIPaccountbalance` decimal(20,3) DEFAULT NULL,
  `WIPperbird` decimal(20,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breederbatchlocationwiseopeningdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchopeningid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `balanceqty` decimal(20,3) DEFAULT NULL,
  `locationid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `shedpenid` int(11) DEFAULT NULL,
  `penqty` decimal(20,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breederbatchmalefemaleopeningdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchopeningid` int(11) DEFAULT NULL,
  `itemtype` tinyint(4) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `placeqty` decimal(20,3) DEFAULT NULL,
  `rate` decimal(9,3) DEFAULT NULL,
  `birdvalue` decimal(20,3) DEFAULT NULL,
  `liveqty` decimal(20,3) DEFAULT NULL,
  `mortality` int(11) DEFAULT NULL,
  `culls` int(11) DEFAULT NULL,
  `cullssaleqty` int(11) DEFAULT NULL,
  `regularsale` int(11) DEFAULT NULL,
  `totalsale` int(11) DEFAULT NULL,
  `goodeggsqty` int(11) DEFAULT NULL,
  `flooreggsqty` int(11) DEFAULT NULL,
  `othereggsqty` int(11) DEFAULT NULL,
  `totaleggs` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breederbatchopening` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchid` int(11) DEFAULT NULL,
  `livebatchdate` date DEFAULT NULL,
  `phasestatusid` int(11) DEFAULT NULL,
  `ageindays` int(11) DEFAULT NULL,
  `ageinweeks` decimal(9,3) DEFAULT NULL,
  `batchplacementdate` date DEFAULT NULL,
  `firstdaydate` date DEFAULT NULL,
  `batchstatusid` int(11) DEFAULT NULL,
  `expectedphasestatusid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `receiptremark` varchar(100) DEFAULT NULL,
  `jeremark` varchar(100) DEFAULT NULL,
  `materialreceiptid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `breederbatchplacement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) DEFAULT NULL,
  `breederbatchid` int(11) DEFAULT NULL,
  `placementscheduleid` int(11) DEFAULT NULL,
  `firstdaydate` date DEFAULT NULL,
  `grpono` int(11) DEFAULT NULL,
  `placementdate` date DEFAULT NULL,
  `phasestatusid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederbatchplacementdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchplacementid` int(11) DEFAULT NULL,
  `breedertypeid` int(11) DEFAULT NULL,
  `breedershedid` int(11) DEFAULT NULL,
  `breedershedpenid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` decimal(9,3) DEFAULT NULL,
  `placementscheduledetailid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederbatchtransfer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromlocationid` int(11) DEFAULT NULL,
  `tolocationid` int(11) DEFAULT NULL,
  `fromshedid` int(11) DEFAULT NULL,
  `transferdate` date DEFAULT NULL,
  `breederbatchid` int(11) DEFAULT NULL,
  `phasestatusid` int(11) DEFAULT NULL,
  `isshedtransfer` tinyint(4) DEFAULT NULL,
  `transferid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederbatchtransferdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchtransferid` int(11) DEFAULT NULL,
  `toshedid` int(11) DEFAULT NULL,
  `fromlineid` int(11) DEFAULT NULL,
  `tolineid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `nonproductivebird` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederdailyconsumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederdailytransactionid` int(11) NOT NULL,
  `consumptiontypeid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `shedlineid` int(11) DEFAULT NULL,
  `isherbal` tinyint(1) DEFAULT NULL,
  `standardconsumption` decimal(20,3) DEFAULT NULL,
  `quantity` decimal(20,3) NOT NULL,
  `issuedetailid` int(11) DEFAULT NULL,
  `breederitemid` int(11) DEFAULT NULL,
  `itemvalue` decimal(30,6) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederdailymortality` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederdailytransactionid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `shedlineid` int(11) NOT NULL,
  `avgweight` decimal(9,3) NOT NULL,
  `totalmortality` int(11) NOT NULL,
  `mortalityreasonid` int(11) DEFAULT NULL,
  `totalculls` int(11) NOT NULL,
  `cullsreasonid` int(11) DEFAULT NULL,
  `issuedetailid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederdailyotherdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederdailytransactionid` int(11) NOT NULL,
  `lighton` varchar(45) DEFAULT NULL,
  `lightoff` varchar(45) DEFAULT NULL,
  `duration` decimal(9,2) DEFAULT NULL,
  `temperature` decimal(9,3) DEFAULT NULL,
  `humidity` decimal(9,3) DEFAULT NULL,
  `waterconsumption` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederdailytransaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) DEFAULT NULL,
  `shedid` int(11) NOT NULL,
  `breederbatchid` int(11) NOT NULL,
  `createdby` int(11) NOT NULL,
  `transactiondate` date NOT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approvaldate` date DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `placementdate` date DEFAULT NULL,
  `ageinweek` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `issueid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederfeedstandard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `standardname` varchar(200) NOT NULL,
  `breednametypeid` int(11) DEFAULT NULL,
  `breeditemid` int(11) DEFAULT NULL,
  `fromdate` date NOT NULL,
  `todate` date NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederfeedstandarddetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederfeedstandardid` int(11) NOT NULL,
  `weeknumber` tinyint(4) NOT NULL,
  `itemid` int(11) NOT NULL,
  `feedconsumed` decimal(9,3) DEFAULT NULL,
  `cumulativefeed` decimal(9,3) DEFAULT NULL,
  `weeklybodyweight` decimal(9,3) DEFAULT NULL,
  `weeklygain` decimal(9,3) DEFAULT NULL,
  `phaseid` smallint(6) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederfeedstandardlocation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederfeedstandardid` int(11) NOT NULL,
  `locationid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederperformance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `week` tinyint(6) NOT NULL,
  `totaleggspercenthw` decimal(8,3) DEFAULT NULL,
  `hatcheggspercenthw` decimal(8,3) DEFAULT NULL,
  `mortality` decimal(8,3) DEFAULT NULL,
  `percentheweekly` decimal(8,3) DEFAULT NULL,
  `totaleggshh` decimal(8,3) DEFAULT NULL,
  `hatcheggshh` decimal(8,3) DEFAULT NULL,
  `weeklypercenthatch` decimal(8,3) DEFAULT NULL,
  `chickshh` decimal(8,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederperformanceobjective` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) NOT NULL,
  `ageinweek` tinyint(4) DEFAULT NULL,
  `livability` decimal(9,3) DEFAULT NULL,
  `hdinpercent` decimal(9,3) DEFAULT NULL,
  `heinpercent` decimal(9,3) DEFAULT NULL,
  `hhpperweek` decimal(9,3) DEFAULT NULL,
  `cumhhp` decimal(9,3) DEFAULT NULL,
  `hhheperweek` decimal(9,3) DEFAULT NULL,
  `cumhhhe` decimal(9,3) DEFAULT NULL,
  `hatchinpercent` decimal(9,3) DEFAULT NULL,
  `chicksperweek` decimal(9,3) DEFAULT NULL,
  `cumchicks` decimal(9,3) DEFAULT NULL,
  `suggestedfeedingram` decimal(9,3) DEFAULT NULL,
  `fertilityinpercent` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederphase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phasesequence` int(11) NOT NULL,
  `phasename` varchar(200) NOT NULL,
  `fromweek` tinyint(4) NOT NULL,
  `toweek` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederplacementschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `schedulefordate` date NOT NULL,
  `batchid` int(11) DEFAULT NULL,
  `totalshedcapacity` int(11) NOT NULL,
  `totalmaleproposedqty` int(11) NOT NULL,
  `totalfemaleproposedqty` int(11) NOT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approveddate` date DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `createdby` int(11) NOT NULL,
  `statusid` int(11) NOT NULL,
  `requestid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederplacementscheduledetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `placementscheduleid` int(11) DEFAULT NULL,
  `shedreadyid` int(11) DEFAULT NULL,
  `breedershedid` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `maleproposalquantity` int(11) DEFAULT NULL,
  `femaleproposalquantity` int(11) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederreasons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typeid` int(11) NOT NULL,
  `reason` varchar(300) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedulename` varchar(200) NOT NULL,
  `breederscheduletypeid` int(11) NOT NULL,
  `breednametypeid` int(11) DEFAULT NULL,
  `breeditemid` int(11) DEFAULT NULL,
  `fromdate` date NOT NULL,
  `todate` date NOT NULL,
  `locationids` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederscheduledetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederscheduleid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `fromweek` tinyint(4) DEFAULT NULL,
  `toweek` tinyint(4) DEFAULT NULL,
  `weeknumber` tinyint(4) DEFAULT NULL,
  `method` varchar(100) DEFAULT NULL,
  `quantity` decimal(9,3) NOT NULL,
  `feedunitid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breederschedulelocation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederscheduleid` int(11) NOT NULL,
  `locationid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breedersetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shedrestperiod` int(11) DEFAULT NULL,
  `defaultmalechickid` int(11) DEFAULT NULL,
  `defaultmalechickcost` decimal(8,3) DEFAULT NULL,
  `defaultfemalechickid` int(11) DEFAULT NULL,
  `defaultfemalechickcost` decimal(8,3) DEFAULT NULL,
  `defaultchickwarehouseid` int(11) DEFAULT NULL,
  `malepercentage` decimal(9,3) DEFAULT NULL,
  `hatchingitemgroupids` varchar(200) DEFAULT NULL,
  `defaultcommercialeggsitemid` int(11) DEFAULT NULL,
  `defaultcrackedeggsitemid` int(11) DEFAULT NULL,
  `defaultdoubleyolkeggsitemid` int(11) DEFAULT NULL,
  `defaulteggsitemid` int(11) DEFAULT NULL,
  `labourcharge` decimal(8,3) DEFAULT NULL,
  `overheadcost` decimal(8,3) DEFAULT NULL,
  `defaultoutsidehatcherywarehouseid` int(11) DEFAULT NULL,
  `eggspredictionperbird` int(11) DEFAULT NULL,
  `malestandardweight` decimal(9,3) DEFAULT NULL,
  `femalestandardweight` decimal(9,3) DEFAULT NULL,
  `feeditemgroupids` varchar(200) DEFAULT NULL,
  `medicineitemgroupids` varchar(200) DEFAULT NULL,
  `vaccineitemgroupids` varchar(200) DEFAULT NULL,
  `vitaminitemgroupids` varchar(200) DEFAULT NULL,
  `breeditemgroupids` varchar(200) DEFAULT NULL,
  `chicksitemgroupids` varchar(200) DEFAULT NULL,
  `hatchingeggscost` decimal(9,3) DEFAULT NULL,
  `commercialeggscost` decimal(9,3) DEFAULT NULL,
  `crackedeggscost` decimal(9,3) DEFAULT NULL,
  `doubleyolkeggscost` decimal(9,3) DEFAULT NULL,
  `costofgoodsoldledgerid` int(11) DEFAULT NULL,
  `WIPledgerid` int(11) DEFAULT NULL,
  `grpowithoutinvoiceledgerid` int(11) DEFAULT NULL,
  `cashledgerid` int(11) DEFAULT NULL,
  `freightledgerid` int(11) DEFAULT NULL,
  `discountledgerid` int(11) DEFAULT NULL,
  `eggsitemgroupids` varchar(200) DEFAULT NULL,
  `stockledgerid` int(11) DEFAULT NULL,
  `mortalityledgerid` int(11) DEFAULT NULL,
  `feedledgerid` int(11) DEFAULT NULL,
  `vaccineledgerid` int(11) DEFAULT NULL,
  `vitaminledgerid` int(11) DEFAULT NULL,
  `medicineledgerid` int(11) DEFAULT NULL,
  `amortizationledgerid` int(11) DEFAULT NULL,
  `ctrlaccledgerid` int(11) DEFAULT NULL,
  `inventorygainandlossledgerid` int(11) DEFAULT NULL,
  `wastageeggsitemid` int(11) DEFAULT NULL,
  `wastageeggscost` decimal(15,3) DEFAULT NULL,
  `defaultcullswarehouseid` int(11) DEFAULT NULL,
  `amortizationcoststd` tinyint(4) DEFAULT NULL,
  `birdcoststd` tinyint(4) DEFAULT NULL,
  `amortizationcostnonprodbird` tinyint(4) DEFAULT NULL,
  `birdcostnonprodbird` tinyint(4) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breedersettingegglocations` (
  `id` int(11) NOT NULL,
  `locationid` int(11) NOT NULL,
  `breederwarehouseid` int(11) DEFAULT NULL,
  `eggscollectionwarehouseid` int(11) DEFAULT NULL,
  `coldroomwarehouseid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breedershed` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) NOT NULL,
  `shedname` varchar(200) NOT NULL,
  `capacity` int(11) NOT NULL,
  `statusid` int(11) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `warhouseid` int(11) NOT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `shedtypeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breedershedline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breedershedid` int(11) NOT NULL,
  `linename` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breedershedparameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parametertypeid` int(11) NOT NULL,
  `parametername` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `requiredratio` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `ismandatory` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `breedershedready` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breedershedid` int(11) NOT NULL,
  `batchid` int(11) DEFAULT NULL,
  `batchstartdate` date DEFAULT NULL,
  `restperiod` int(11) DEFAULT NULL,
  `createdby` int(11) NOT NULL,
  `createddate` date NOT NULL,
  `finalcleaningdate` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `breedershedreadydetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breedershedreadyid` int(11) NOT NULL,
  `parametertypeid` int(11) NOT NULL,
  `shedparameterid` int(11) NOT NULL,
  `isapplied` tinyint(4) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `candlingtest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setterbatchid` int(11) DEFAULT NULL,
  `setterid` int(11) NOT NULL,
  `breederbatchid` int(11) DEFAULT NULL,
  `testdate` date NOT NULL,
  `actualquantity` int(11) NOT NULL,
  `samplequantity` int(11) NOT NULL,
  `trueinfertile` int(11) DEFAULT NULL,
  `clears` int(11) DEFAULT NULL,
  `bloodring` int(11) DEFAULT NULL,
  `membrane` int(11) DEFAULT NULL,
  `agemortality` int(11) DEFAULT NULL,
  `fertility` decimal(8,3) NOT NULL,
  `fertilitypercentage` decimal(8,2) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cbf_batch_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmer_enquiry_id` int(11) DEFAULT NULL,
  `batch_number` varchar(50) DEFAULT NULL,
  `batch_qty` int(11) DEFAULT NULL,
  `batch_place_qty` int(11) DEFAULT NULL,
  `live_batch_qty` int(11) DEFAULT NULL,
  `breed_id` int(11) DEFAULT NULL,
  `batch_schedule_id` int(11) DEFAULT NULL,
  `line_supervisor_id` int(11) DEFAULT NULL,
  `farm_rest_period` int(11) DEFAULT NULL,
  `total_mortality` int(11) DEFAULT NULL,
  `scheme_id` int(11) DEFAULT NULL,
  `production_qty` int(11) DEFAULT NULL,
  `excess_birds` int(11) DEFAULT NULL,
  `shortage_chicks` int(11) DEFAULT NULL,
  `current_density` int(11) DEFAULT NULL,
  `processing_qty` int(11) DEFAULT NULL,
  `batch_date` date DEFAULT NULL,
  `batch_place_date` date DEFAULT NULL,
  `live_batch_date` date DEFAULT NULL,
  `batch_lifting_date` date DEFAULT NULL,
  `batch_close_date` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `body_weight` decimal(9,3) DEFAULT NULL,
  `culls` int(11) DEFAULT NULL,
  `compensation` int(11) DEFAULT NULL,
  `sale_qty` int(11) DEFAULT NULL,
  `weak_chicks` int(11) DEFAULT NULL,
  `batch_cost` decimal(9,3) DEFAULT NULL,
  `remark` varchar(150) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `costperbird` decimal(12,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_batchbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `updateddate` date DEFAULT NULL,
  `cbfbatchid` int(11) DEFAULT NULL,
  `cbfshedid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `transactionname` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_birdcost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) DEFAULT NULL,
  `issueqty` decimal(20,3) DEFAULT NULL,
  `transactiondate` date DEFAULT NULL,
  `unitcost` decimal(30,3) DEFAULT NULL,
  `itemvalue` decimal(30,3) DEFAULT NULL,
  `itembatch` varchar(200) DEFAULT NULL,
  `cbfbatchid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `transactionid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_birdsalesorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stdsalesorderid` int(11) DEFAULT NULL,
  `vendorid` int(11) DEFAULT NULL,
  `branchid` int(11) DEFAULT NULL,
  `orderdate` date DEFAULT NULL,
  `fromweight` decimal(9,3) DEFAULT NULL,
  `toweight` decimal(9,3) DEFAULT NULL,
  `totalsaleweight` decimal(12,3) DEFAULT NULL,
  `rateperkg` decimal(9,3) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_birdsalesorderdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbfbirdsalesorderid` int(11) DEFAULT NULL,
  `cbf_batchid` int(11) DEFAULT NULL,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `batchsaleweight` decimal(12,3) DEFAULT NULL,
  `pendingweight` decimal(12,3) DEFAULT NULL,
  `birdqty` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_branchwisesupervisor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_branchwisesupervisordetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchwisesupervisorid` int(11) DEFAULT NULL,
  `empids` varchar(100) DEFAULT NULL,
  `lineid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_chick_placement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) DEFAULT NULL,
  `create_batch_schedule_id` int(11) DEFAULT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `placement_date` date DEFAULT NULL,
  `first_day_date` date DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `std_lifting_age` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `farmer_enquiry_id` int(11) DEFAULT NULL,
  `shed_id` int(11) DEFAULT NULL,
  `chick_qty` int(11) DEFAULT NULL,
  `week_chicks` int(11) DEFAULT NULL,
  `free_qty` int(11) DEFAULT NULL,
  `culls` int(11) DEFAULT NULL,
  `shortage` int(11) DEFAULT NULL,
  `mortality` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_chick_placement_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chick_placement_id` int(11) DEFAULT NULL,
  `shed_id` int(11) DEFAULT NULL,
  `chick_qty` int(11) DEFAULT NULL,
  `week_chicks` int(11) DEFAULT NULL,
  `free_qty` int(11) DEFAULT NULL,
  `culls` int(11) DEFAULT NULL,
  `shortage` int(11) DEFAULT NULL,
  `mortality` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_chicksmortality` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grpoid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `culls` int(11) DEFAULT NULL,
  `mortality` int(11) DEFAULT NULL,
  `shortage` int(11) DEFAULT NULL,
  `weak_chicks` int(11) DEFAULT NULL,
  `freeqty` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_dailyconsumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbfdailytransactionid` int(11) DEFAULT NULL,
  `consumptiontypeid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `isherbal` tinyint(4) DEFAULT NULL,
  `stdconsumption` decimal(9,3) DEFAULT NULL,
  `quantity` decimal(9,3) DEFAULT NULL,
  `issuedetailid` int(11) DEFAULT NULL,
  `breeditemid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `itemvalue` decimal(20,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_dailymortality` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbfdailytransactionid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `avgweight` decimal(9,3) DEFAULT NULL,
  `totalmortality` int(11) DEFAULT NULL,
  `mortalityreasonid` int(11) DEFAULT NULL,
  `totalculls` int(11) DEFAULT NULL,
  `cullsreasonid` int(11) DEFAULT NULL,
  `issuedetailid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_dailyotherdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbfdailytransactionid` int(11) DEFAULT NULL,
  `lighton` varchar(45) DEFAULT NULL,
  `lightoff` varchar(45) DEFAULT NULL,
  `duration` decimal(9,3) DEFAULT NULL,
  `temperature` decimal(9,3) DEFAULT NULL,
  `humidity` decimal(9,3) DEFAULT NULL,
  `waterconsumption` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_dailytransaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `cbf_batchid` int(11) DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `transactiondate` date DEFAULT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approvaldate` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `remark` varchar(150) DEFAULT NULL,
  `readyforsale` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `issueid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_delivery_weights` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `liftingscheduleid` int(11) DEFAULT NULL,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `birdsalesorderid` int(11) DEFAULT NULL,
  `stdsalesorderid` int(11) DEFAULT NULL,
  `liftingdate` date DEFAULT NULL,
  `totaldeliveredqty` int(11) DEFAULT NULL,
  `totaldeliveredwt` decimal(12,3) DEFAULT NULL,
  `totaldeliverycost` decimal(12,3) DEFAULT NULL,
  `excessbirds` int(11) DEFAULT NULL,
  `birdshortage` int(11) DEFAULT NULL,
  `islastdelivery` tinyint(4) DEFAULT NULL,
  `stddeliveryid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `customerid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_delivery_weights_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbf_delivery_weightsid` int(11) DEFAULT NULL,
  `cbf_batchid` int(11) DEFAULT NULL,
  `plannedqty` int(11) DEFAULT NULL,
  `deliveredqty` int(11) DEFAULT NULL,
  `plannedwt` decimal(12,3) DEFAULT NULL,
  `deliveredwt` decimal(12,3) DEFAULT NULL,
  `liftingtime` varchar(45) DEFAULT NULL,
  `rateperkg` decimal(9,3) DEFAULT NULL,
  `totalcost` decimal(12,3) DEFAULT NULL,
  `excessbirds` int(11) DEFAULT NULL,
  `birdshortage` int(11) DEFAULT NULL,
  `livebirdcost` decimal(15,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_documentcollection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enquiry_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_documentcollectiondetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_collection_id` int(11) DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL,
  `image_url` varchar(250) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_farmeragreement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partyid` int(11) DEFAULT NULL,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `emailid` varchar(150) DEFAULT NULL,
  `agreementmethodid` int(11) DEFAULT NULL,
  `agreementtypeid` int(11) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  `terminationdate` date DEFAULT NULL,
  `signingdate` date DEFAULT NULL,
  `schemeid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `remark` varchar(150) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_farmeragreement_documentdetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmeragreementid` int(11) DEFAULT NULL,
  `documentid` int(11) DEFAULT NULL,
  `iscollected` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_farmerenquiry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supervisor_id` int(11) DEFAULT NULL,
  `enquiry_date` date DEFAULT NULL,
  `farmer_name` varchar(250) DEFAULT NULL,
  `farmer_id` int(11) DEFAULT NULL,
  `farm_name` varchar(250) DEFAULT NULL,
  `farm_type_id` int(11) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `mobile_no` varchar(200) DEFAULT NULL,
  `incharge_name` varchar(250) DEFAULT NULL,
  `shed_type_id` int(11) DEFAULT NULL,
  `property_owner` varchar(250) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `occupation` varchar(250) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `line_id` int(11) DEFAULT NULL,
  `rest_period` int(11) DEFAULT NULL,
  `farm_area_length` decimal(12,3) DEFAULT NULL,
  `farm_area_width` decimal(12,3) DEFAULT NULL,
  `total_area` decimal(12,3) DEFAULT NULL,
  `density` decimal(12,3) DEFAULT NULL,
  `incharge_contact_no` varchar(200) DEFAULT NULL,
  `water_facility_id` int(11) DEFAULT NULL,
  `over_head_tank_capacity` decimal(12,3) DEFAULT NULL,
  `over_head_tank_type_id` int(11) DEFAULT NULL,
  `holding_tank_capacity` decimal(12,3) DEFAULT NULL,
  `holding_tank_type_id` int(11) DEFAULT NULL,
  `flooring_id` int(11) DEFAULT NULL,
  `roofing_id` int(11) DEFAULT NULL,
  `diesel_brooder` int(11) DEFAULT NULL,
  `gas_brooder` int(11) DEFAULT NULL,
  `cool_brooder` int(11) DEFAULT NULL,
  `farm_partition` int(11) DEFAULT NULL,
  `electric_brooder` int(11) DEFAULT NULL,
  `wood_brooder` int(11) DEFAULT NULL,
  `thermometer` int(11) DEFAULT NULL,
  `spray_pump` int(11) DEFAULT NULL,
  `road_facility_id` int(11) DEFAULT NULL,
  `mseb_connection_id` int(11) DEFAULT NULL,
  `feed_room_facility` int(4) DEFAULT NULL,
  `curtain_type_id` int(11) DEFAULT NULL,
  `cross_curtains` tinyint(4) DEFAULT NULL,
  `foggers` tinyint(4) DEFAULT NULL,
  `mortality_disposal_pit` tinyint(4) DEFAULT NULL,
  `generator` tinyint(4) DEFAULT NULL,
  `refrigerator` tinyint(4) DEFAULT NULL,
  `inverter` tinyint(4) DEFAULT NULL,
  `tus_storage_facility` tinyint(4) DEFAULT NULL,
  `thermos` tinyint(4) DEFAULT NULL,
  `out_side_curtains` tinyint(4) DEFAULT NULL,
  `ceiling_curtains` tinyint(4) DEFAULT NULL,
  `center_curtains` tinyint(4) DEFAULT NULL,
  `contract_type_id` int(11) DEFAULT NULL,
  `reasons_for_disc_per` varchar(250) DEFAULT NULL,
  `cityid` int(11) DEFAULT NULL,
  `district` varchar(250) DEFAULT NULL,
  `taluka` varchar(250) DEFAULT NULL,
  `post` varchar(250) DEFAULT NULL,
  `gat_sr_no` varchar(250) DEFAULT NULL,
  `area` decimal(12,3) DEFAULT NULL,
  `valuation` decimal(12,3) DEFAULT NULL,
  `owner_name` varchar(250) DEFAULT NULL,
  `chick_capacity` decimal(12,3) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `distance_from_branch` decimal(12,3) DEFAULT NULL,
  `distance_from_feed_mill` decimal(12,3) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_farmerenquiry_equipmentdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `fulfillment_qty` decimal(12,3) DEFAULT NULL,
  `fulfillment` tinyint(4) DEFAULT NULL,
  `companyid` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_farmerenquiry_prevperformancehistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `contract_type_id` int(11) DEFAULT NULL,
  `batches_grown` varchar(45) DEFAULT NULL,
  `avg_body_weight` decimal(9,3) DEFAULT NULL,
  `fcr` decimal(9,3) DEFAULT NULL,
  `mortality` decimal(9,3) DEFAULT NULL,
  `eef` decimal(9,3) DEFAULT NULL,
  `rearing_charges` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_farmerenquiry_sheddimensiondetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `shed_name` varchar(100) DEFAULT NULL,
  `width` decimal(9,3) DEFAULT NULL,
  `length` decimal(9,3) DEFAULT NULL,
  `total_sq_ft` decimal(12,3) DEFAULT NULL,
  `side_wall_height` decimal(9,3) DEFAULT NULL,
  `wire_mash_height` decimal(9,3) DEFAULT NULL,
  `side_height` decimal(9,3) DEFAULT NULL,
  `center_height` decimal(9,3) DEFAULT NULL,
  `foundation_height` decimal(9,3) DEFAULT NULL,
  `dist_bet_shed` decimal(9,3) DEFAULT NULL,
  `dist_from_branch` decimal(9,3) DEFAULT NULL,
  `dist_from_feed_mill` decimal(9,3) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_farmerenquiry_wateranalysis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `water_parameter_id` int(11) DEFAULT NULL,
  `result` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_growingcharges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbf_batchid` int(11) DEFAULT NULL,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `branchid` int(11) DEFAULT NULL,
  `schemeid` int(11) DEFAULT NULL,
  `firstdaydate` date DEFAULT NULL,
  `batchclosedate` date DEFAULT NULL,
  `breeditemid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `applyschemefeedcost` tinyint(4) DEFAULT NULL,
  `applyschememedicinecost` tinyint(4) DEFAULT NULL,
  `applyschemevaccinecost` tinyint(4) DEFAULT NULL,
  `editdeductionvalues` tinyint(4) DEFAULT NULL,
  `productionqty` int(11) DEFAULT NULL,
  `batchplaceqty` int(11) DEFAULT NULL,
  `cullspercent` decimal(9,3) DEFAULT NULL,
  `compensationpercent` decimal(9,3) DEFAULT NULL,
  `birdsavailable` int(11) DEFAULT NULL,
  `FWmortality` int(11) DEFAULT NULL,
  `FWmortalitypercent` decimal(9,3) DEFAULT NULL,
  `totalmortality` int(11) DEFAULT NULL,
  `totalmortalitypercent` decimal(9,3) DEFAULT NULL,
  `feedtransferin` decimal(12,3) DEFAULT NULL,
  `feedtransferout` decimal(12,3) DEFAULT NULL,
  `totalfeedconsumed` decimal(12,3) DEFAULT NULL,
  `totalfeedcost` decimal(12,3) DEFAULT NULL,
  `totalmedicinecost` decimal(12,3) DEFAULT NULL,
  `totalvaccinecost` decimal(12,3) DEFAULT NULL,
  `administrationcost` decimal(12,3) DEFAULT NULL,
  `actualproductioncost` decimal(12,3) DEFAULT NULL,
  `stdproductioncost` decimal(12,3) DEFAULT NULL,
  `schemeproductioncost` decimal(12,3) DEFAULT NULL,
  `totalsaleqty` int(11) DEFAULT NULL,
  `totalsaleweight` decimal(12,3) DEFAULT NULL,
  `totalprocessingqty` int(11) DEFAULT NULL,
  `totalprocessingweight` decimal(12,3) DEFAULT NULL,
  `totalbirdssold` int(11) DEFAULT NULL,
  `excessbirds` int(11) DEFAULT NULL,
  `totalweightofbird` decimal(12,3) DEFAULT NULL,
  `avgweightofbird` decimal(9,3) DEFAULT NULL,
  `fcr` decimal(12,3) DEFAULT NULL,
  `cfcr` decimal(12,3) DEFAULT NULL,
  `avgsellingrate` decimal(12,3) DEFAULT NULL,
  `stdrearingchargekg` decimal(12,3) DEFAULT NULL,
  `actualrearingchargekg` decimal(12,3) DEFAULT NULL,
  `rearingchrgebird` decimal(12,3) DEFAULT NULL,
  `totalrearingcharge` decimal(12,3) DEFAULT NULL,
  `additionalincentive` decimal(12,3) DEFAULT NULL,
  `mortalityincentive` decimal(12,3) DEFAULT NULL,
  `excessbirdincentive` decimal(12,3) DEFAULT NULL,
  `vehicleincentive` decimal(12,3) DEFAULT NULL,
  `eefvalue` decimal(12,3) DEFAULT NULL,
  `eefgradeid` int(11) DEFAULT NULL,
  `avgliftingage` decimal(9,3) DEFAULT NULL,
  `perdaygrowthgrm` decimal(9,3) DEFAULT NULL,
  `fcrdeduction` decimal(12,3) DEFAULT NULL,
  `totalmortalitydeduction` decimal(12,3) DEFAULT NULL,
  `FWmortalitydeduction` decimal(12,3) DEFAULT NULL,
  `birdshortage` int(11) DEFAULT NULL,
  `birdshortageamt` decimal(12,3) DEFAULT NULL,
  `compensateamt` decimal(12,3) DEFAULT NULL,
  `alldeduction` decimal(12,3) DEFAULT NULL,
  `allincentive` decimal(12,3) DEFAULT NULL,
  `total` decimal(12,3) DEFAULT NULL,
  `totaldownpayment` decimal(12,3) DEFAULT NULL,
  `rearingchargepayable` decimal(12,3) DEFAULT NULL,
  `freightamt` decimal(12,3) DEFAULT NULL,
  `tds` decimal(12,3) DEFAULT NULL,
  `netpayableamt` decimal(12,3) DEFAULT NULL,
  `isinvoicebooked` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_incentivescheme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schemeapplyby` int(11) DEFAULT NULL,
  `schemename` varchar(100) DEFAULT NULL,
  `breeditemid` int(11) DEFAULT NULL,
  `branchid` int(11) DEFAULT NULL,
  `fromdate` date DEFAULT NULL,
  `todate` date DEFAULT NULL,
  `applyto` varchar(150) DEFAULT NULL,
  `isbyfunctionapplicable` tinyint(4) DEFAULT NULL,
  `applybyemployee` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_incentivescheme_employeeorposition` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incentiveschemeid` int(11) DEFAULT NULL,
  `employeeid` int(11) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `percentage` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_incentivescheme_rateperkgoneef` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incentiveschemeid` int(11) DEFAULT NULL,
  `fromeef` decimal(9,3) DEFAULT NULL,
  `toeef` decimal(9,3) DEFAULT NULL,
  `rateperkg` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_lifting_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) DEFAULT NULL,
  `schedule_date` date DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_lifting_schedule_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lifting_schedule_id` int(11) DEFAULT NULL,
  `cbfbirdsalesorderid` int(11) DEFAULT NULL,
  `cbf_batchid` int(11) DEFAULT NULL,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `batchweight` decimal(12,3) DEFAULT NULL,
  `plannedweight` decimal(12,3) DEFAULT NULL,
  `approvedweight` decimal(12,3) DEFAULT NULL,
  `batchcost` decimal(12,3) DEFAULT NULL,
  `line_supervisor_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_line` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` int(11) DEFAULT NULL,
  `linename` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_linedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lineid` int(11) DEFAULT NULL,
  `fromvillageid` int(11) DEFAULT NULL,
  `tovillageid` int(11) DEFAULT NULL,
  `km` decimal(12,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_openingbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `eggage` decimal(9,3) DEFAULT NULL,
  `locationid` int(11) DEFAULT NULL,
  `sourceid` int(11) DEFAULT NULL,
  `vendorid` int(11) DEFAULT NULL,
  `breeditemid` int(11) DEFAULT NULL,
  `fromwarehouseid` int(11) DEFAULT NULL,
  `hatchid` int(11) DEFAULT NULL,
  `stockledgerid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_openingbalancedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbfopeningbalanceid` int(11) DEFAULT NULL,
  `farmerenquiryid` int(11) DEFAULT NULL,
  `cbfbatchno` varchar(100) DEFAULT NULL,
  `cbfbatchid` int(11) DEFAULT NULL,
  `cbfshedid` int(11) DEFAULT NULL,
  `totalarea` decimal(20,3) DEFAULT NULL,
  `placementdate` date DEFAULT NULL,
  `firstdaydate` date DEFAULT NULL,
  `livebatchdate` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `placementqty` int(11) DEFAULT NULL,
  `mortality` int(11) DEFAULT NULL,
  `saleqty` int(11) DEFAULT NULL,
  `transferqty` int(11) DEFAULT NULL,
  `liveqty` int(11) DEFAULT NULL,
  `saleweight` decimal(20,3) DEFAULT NULL,
  `salevalue` decimal(30,3) DEFAULT NULL,
  `transferweight` decimal(20,3) DEFAULT NULL,
  `transfervalue` decimal(30,3) DEFAULT NULL,
  `totalweight` decimal(30,3) DEFAULT NULL,
  `feedconsume` decimal(20,3) DEFAULT NULL,
  `feedvalue` decimal(30,3) DEFAULT NULL,
  `medicinevalue` decimal(30,3) DEFAULT NULL,
  `vaccinevalue` decimal(30,3) DEFAULT NULL,
  `vitaminvalue` decimal(30,3) DEFAULT NULL,
  `herbalvalue` decimal(30,3) DEFAULT NULL,
  `batchstatusid` int(11) DEFAULT NULL,
  `shortage` int(11) DEFAULT NULL,
  `excess` int(11) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `supervisorid` int(11) DEFAULT NULL,
  `liftingdate` date DEFAULT NULL,
  `totalbirdvalue` decimal(30,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_procurementschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `schedulefordate` date DEFAULT NULL,
  `totalshedcapacity` int(11) DEFAULT NULL,
  `totalchicksquantity` int(11) DEFAULT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approveddate` date DEFAULT NULL,
  `remark` varchar(150) DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `branchid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_procurementscheduledetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `procurementscheduleid` int(11) DEFAULT NULL,
  `shedreadyid` int(11) DEFAULT NULL,
  `cbfshedid` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `chicksitemid` int(11) DEFAULT NULL,
  `chicksproposalquantity` int(11) DEFAULT NULL,
  `sourceid` int(11) DEFAULT NULL,
  `requestid` int(11) DEFAULT NULL,
  `batchid` int(11) DEFAULT NULL,
  `remark` varchar(150) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_productiondeduction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coststructureid` int(11) DEFAULT NULL,
  `deductionapplyby` int(11) DEFAULT NULL,
  `fromrate` decimal(9,3) DEFAULT NULL,
  `torate` decimal(9,3) DEFAULT NULL,
  `dividendperrupee` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_productionincentive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coststructureid` int(11) DEFAULT NULL,
  `incentiveapplyby` int(11) DEFAULT NULL,
  `fromrate` decimal(9,3) DEFAULT NULL,
  `torate` decimal(9,3) DEFAULT NULL,
  `dividendperrupee` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_reasons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typeid` int(11) DEFAULT NULL,
  `reason` varchar(150) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_shedready` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shedid` int(11) DEFAULT NULL,
  `restperiod` int(11) DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `createddate` date DEFAULT NULL,
  `finalcleaningdate` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_shedreadydetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbfshedreadyid` int(11) DEFAULT NULL,
  `parametertypeid` int(11) DEFAULT NULL,
  `shedparameterid` int(11) DEFAULT NULL,
  `isapplied` tinyint(4) DEFAULT NULL,
  `remark` varchar(150) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbf_villages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` int(11) DEFAULT NULL,
  `villagename` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbffarmparameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parametertypeid` int(11) NOT NULL,
  `parametername` varchar(200) NOT NULL,
  `requiredratio` varchar(200) DEFAULT NULL,
  `ismandatory` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbfschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedulename` varchar(200) NOT NULL,
  `cbfscheduletypeid` int(11) NOT NULL,
  `breednameid` int(11) NOT NULL,
  `fromdate` date NOT NULL,
  `todate` date NOT NULL,
  `locationids` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbfscheduledetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbfscheduleid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `fromage` int(11) DEFAULT NULL,
  `toage` int(11) DEFAULT NULL,
  `ageindays` tinyint(4) DEFAULT NULL,
  `method` varchar(200) DEFAULT NULL,
  `quantity` decimal(9,3) NOT NULL,
  `itemunitid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbfsetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `defaultchickitemid` int(11) NOT NULL,
  `standardweight` decimal(9,3) NOT NULL,
  `shedrestperiod` int(11) DEFAULT NULL,
  `defaultchickcost` decimal(9,3) DEFAULT NULL,
  `labourcharge` decimal(9,3) DEFAULT NULL,
  `overheadcost` decimal(9,3) DEFAULT NULL,
  `defaultcbfwarehouseid` int(11) DEFAULT NULL,
  `feeditemgroupids` varchar(200) DEFAULT NULL,
  `medicineitemgroupids` varchar(200) DEFAULT NULL,
  `vaccineitemgroupids` varchar(200) DEFAULT NULL,
  `vitaminitemgroupids` varchar(200) DEFAULT NULL,
  `breeditemgroupids` varchar(200) DEFAULT NULL,
  `chicksitemgroupids` varchar(200) DEFAULT NULL,
  `supplierledgerid` int(11) DEFAULT NULL,
  `taxid` int(11) DEFAULT NULL,
  `tdsid` int(11) DEFAULT NULL,
  `costofgoodsoldledgerid` int(11) DEFAULT NULL,
  `WIPledgerid` int(11) DEFAULT NULL,
  `grpowithoutinvoiceledgerid` int(11) DEFAULT NULL,
  `ctrlaccledgerid` int(11) DEFAULT NULL,
  `freightledgerid` int(11) DEFAULT NULL,
  `discountledgerid` int(11) DEFAULT NULL,
  `cashledgerid` int(11) DEFAULT NULL,
  `supervisorkmledgerid` int(11) DEFAULT NULL,
  `companyid` varchar(45) DEFAULT NULL,
  `DOCitemid` int(11) DEFAULT NULL,
  `finishgooditemid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbfshedtype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shedtype` varchar(200) NOT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbfstandardchart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chartname` varchar(200) NOT NULL,
  `breednameid` int(11) NOT NULL,
  `locationids` varchar(200) NOT NULL,
  `fromdate` date NOT NULL,
  `todate` date NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cbfstandardchartdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cbfstandardchartid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `age` int(11) NOT NULL,
  `mortality` int(11) NOT NULL,
  `feedconsumption` decimal(9,3) NOT NULL,
  `cumulativefeed` decimal(9,3) NOT NULL,
  `bodyweight` decimal(9,3) NOT NULL,
  `fcr` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `chartof_accout_update` (
  `id` int(11) NOT NULL,
  `groupid` int(11) DEFAULT NULL,
  `main_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `chartofaccount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryid` int(11) DEFAULT NULL,
  `coaname` varchar(150) DEFAULT NULL,
  `glcode` varchar(100) DEFAULT NULL,
  `coatypeid` int(11) DEFAULT NULL,
  `isparent` tinyint(4) DEFAULT NULL,
  `groupid` int(11) DEFAULT NULL,
  `iscontrolacc` tinyint(4) DEFAULT NULL,
  `isblockmanualposting` tinyint(4) DEFAULT NULL,
  `iscashacc` tinyint(4) DEFAULT NULL,
  `isproject` tinyint(4) DEFAULT NULL,
  `projectid` int(11) DEFAULT NULL,
  `is_deleted` tinyint(4) DEFAULT NULL,
  `isactive` tinyint(4) DEFAULT NULL,
  `iscostcenterapplicable` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `checklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sequence` smallint(6) NOT NULL,
  `checkname` varchar(200) NOT NULL,
  `ismandatory` tinyint(4) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `chicksmortality` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grpono` int(11) NOT NULL,
  `itemid` int(11) DEFAULT NULL,
  `culls` int(11) DEFAULT NULL,
  `mortality` int(11) DEFAULT NULL,
  `shortage` int(11) DEFAULT NULL,
  `freeqty` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `chickspullout` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) NOT NULL,
  `hatchbatchid` int(11) NOT NULL,
  `setterbatchid` int(11) NOT NULL,
  `pulloutdate` date NOT NULL,
  `breederbatchid` int(11) DEFAULT NULL,
  `itemid` int(11) NOT NULL,
  `hatcherquantity` int(11) NOT NULL,
  `infertile` int(11) NOT NULL,
  `deadingerm` int(11) NOT NULL,
  `earlymortality` int(11) NOT NULL,
  `middlemortality` int(11) NOT NULL,
  `deadinshell` int(11) NOT NULL,
  `LCM` int(11) NOT NULL,
  `burst` int(11) NOT NULL,
  `totalhatch` int(11) NOT NULL,
  `culls` int(11) NOT NULL,
  `sellable` int(11) NOT NULL,
  `sellableper` decimal(9,3) DEFAULT NULL,
  `unitcost` decimal(9,3) NOT NULL,
  `totalcost` decimal(9,3) NOT NULL,
  `warehouselocationid` int(11) DEFAULT NULL,
  `itemunitid` int(11) NOT NULL,
  `itembatchid` varchar(100) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stateid` int(11) DEFAULT NULL,
  `citycode` varchar(45) DEFAULT NULL,
  `cityname` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `coacategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `common_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discountledgerid` int(11) DEFAULT NULL,
  `cogsledgerid` int(11) DEFAULT NULL,
  `cashledgerid` int(11) DEFAULT NULL,
  `grpowithoutinvoiceledgerid` int(11) DEFAULT NULL,
  `inventorygainandlossledgerid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `profitandlossledgerid` int(11) DEFAULT NULL,
  `grpowithoutpo` tinyint(4) DEFAULT NULL,
  `purchaseinvoicewithoutgrpo` tinyint(4) DEFAULT NULL,
  `purchaseinvoicewithoutpo` tinyint(4) DEFAULT NULL,
  `opening_balance_ledger_id` int(11) DEFAULT NULL,
  `customer_ledger_group_id` int(11) DEFAULT NULL,
  `supplier_ledger_group_id` int(11) DEFAULT NULL,
  `deliverywithoutso` tinyint(4) DEFAULT NULL,
  `salesinvoicewithoutdelivery` tinyint(4) DEFAULT NULL,
  `salesinvoicewithoutso` tinyint(4) DEFAULT NULL,
  `controlaccountledgerid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `commonbranch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchcode` varchar(200) NOT NULL,
  `branchname` varchar(200) NOT NULL,
  `isactive` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `commonbranchline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` int(11) NOT NULL,
  `linename` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `commonlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tablename` varchar(100) NOT NULL,
  `rowdata` json DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `action` varchar(30) NOT NULL,
  `createdby` int(11) NOT NULL,
  `createddate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companyname` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `companycode` varchar(50) NOT NULL,
  `description` varchar(3000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `contactno1` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `contactno2` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `address` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `state` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `statecode` varchar(200) DEFAULT NULL,
  `city` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `countrycode` int(11) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `faxnumber` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `companysubscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companyid` int(11) NOT NULL,
  `productid` int(11) NOT NULL,
  `subscriptionid` int(11) DEFAULT NULL,
  `subscriptiontypeid` int(11) DEFAULT NULL,
  `subscriptiontypename` varchar(100) DEFAULT NULL,
  `licensetypeid` int(11) NOT NULL,
  `licensetypename` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `activationdate` date NOT NULL,
  `frequencytypeid` int(11) NOT NULL,
  `frequencytypename` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `expirydate` date NOT NULL,
  `value` int(11) NOT NULL,
  `statusid` int(11) DEFAULT NULL,
  `statusname` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `consumptionissue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) NOT NULL,
  `consumptionid` int(11) NOT NULL,
  `issuedetailid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `costcenter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dimenssioncode` varchar(45) DEFAULT NULL,
  `dimenssionname` varchar(100) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `isactive` tinyint(4) DEFAULT NULL,
  `isparent` tinyint(4) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `accounts_dimensionid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `coststructure` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `chickcost` decimal(9,3) DEFAULT NULL,
  `administrationcost` decimal(9,3) DEFAULT NULL,
  `fromdate` date DEFAULT NULL,
  `todate` date DEFAULT NULL,
  `mortalitydeduction` decimal(9,3) DEFAULT NULL,
  `feedcost` decimal(9,3) DEFAULT NULL,
  `medicinecost` decimal(9,3) DEFAULT NULL,
  `vaccinecost` decimal(9,3) DEFAULT NULL,
  `changeformula` tinyint(4) DEFAULT NULL,
  `onbird` tinyint(4) DEFAULT NULL,
  `birdincentiveperkg` decimal(9,3) DEFAULT NULL,
  `birdincentiveperbird` decimal(9,3) DEFAULT NULL,
  `birdincentivepercentage` decimal(9,3) DEFAULT NULL,
  `productionincentive` decimal(9,3) DEFAULT NULL,
  `costexceeds` decimal(9,3) DEFAULT NULL,
  `mortalityweek` int(11) DEFAULT NULL,
  `mortalitypercentage` decimal(9,3) DEFAULT NULL,
  `cummulativeper` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `firstweekmortalityper` decimal(9,3) DEFAULT NULL,
  `shortrecovery` decimal(9,3) DEFAULT NULL,
  `minrearingcharges` decimal(9,3) DEFAULT NULL,
  `exbirdincentive` decimal(9,3) DEFAULT NULL,
  `totalmortality` int(11) DEFAULT NULL,
  `coststructurecol` decimal(9,3) DEFAULT NULL,
  `incentiveperkg` decimal(9,3) DEFAULT NULL,
  `shortrecoveryper` decimal(9,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `coststructuredetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coststructureid` int(11) NOT NULL,
  `fromavgweight` decimal(9,3) NOT NULL,
  `toavgaeight` decimal(9,3) NOT NULL,
  `productioncost` decimal(9,3) NOT NULL,
  `rearingcharge` decimal(9,3) NOT NULL,
  `fcr` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `countrycode` varchar(45) NOT NULL,
  `countryname` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `dberrors` (
  `DBErrorID` int(11) NOT NULL AUTO_INCREMENT,
  `ErrorTime` datetime NOT NULL,
  `ErrorProcedure` varchar(200) NOT NULL,
  `ErrorMessage` varchar(500) NOT NULL,
  `ErrorParams` varchar(20000) DEFAULT NULL,
  PRIMARY KEY (`DBErrorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `deduction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coststructureid` int(11) NOT NULL,
  `fromdays` int(11) NOT NULL,
  `todays` int(11) NOT NULL,
  `perratebird` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `density` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) NOT NULL,
  `shedtypeid` int(11) NOT NULL,
  `densityperbird` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `disease` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `diseasename` varchar(200) NOT NULL,
  `diagnosis` varchar(200) NOT NULL,
  `organid` int(11) NOT NULL,
  `lesionid` int(11) NOT NULL,
  `symptomsid` int(11) NOT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `diseasedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `diseaseid` int(11) NOT NULL,
  `treatment` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `docseries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `docname` varchar(200) DEFAULT NULL,
  `doccode` varchar(200) DEFAULT NULL,
  `dbtableaffected` varchar(200) DEFAULT NULL,
  `seriescolumn` varchar(200) DEFAULT NULL,
  `typecolumn` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `documentname` varchar(200) NOT NULL,
  `ismandatory` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eggscollection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `breederbatchid` int(11) NOT NULL,
  `shedid` int(11) NOT NULL,
  `createdby` int(11) NOT NULL,
  `collectiondate` date DEFAULT NULL,
  `productionstartdate` date DEFAULT NULL,
  `productionweek` int(11) DEFAULT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approvaldate` date DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `towarehouseid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `eggscollectiondetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eggscollectionid` int(11) NOT NULL,
  `shedid` int(11) NOT NULL,
  `shedlineid` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `stdquantity` int(11) DEFAULT NULL,
  `time` varchar(50) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `eggsdistributiondetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eggscollectionid` int(11) NOT NULL,
  `shedid` int(11) NOT NULL,
  `itemtypeid` int(11) DEFAULT NULL,
  `itemid` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `avgweight` decimal(9,3) DEFAULT NULL,
  `itembatchid` varchar(200) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `collectiondate` date NOT NULL,
  `breederbatchid` int(11) NOT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `eggsgrade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gradename` varchar(100) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `eggtransfertohatchery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) DEFAULT NULL,
  `fromwarehouseid` int(11) DEFAULT NULL,
  `towarehouseid` int(11) DEFAULT NULL,
  `breederbatchid` int(11) DEFAULT NULL,
  `totaltransferquantity` int(11) DEFAULT NULL,
  `outtime` varchar(50) DEFAULT NULL,
  `transferdate` date DEFAULT NULL,
  `drivername` varchar(100) DEFAULT NULL,
  `drivermobileno` varchar(100) DEFAULT NULL,
  `vehicleno` varchar(50) DEFAULT NULL,
  `isoutsidehatchery` tinyint(4) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `remark` varchar(150) DEFAULT NULL,
  `issueremark` varchar(150) DEFAULT NULL,
  `receiptremark` varchar(150) DEFAULT NULL,
  `servicepoid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `material_transfer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `eggtransfertohatcherydetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eggtransfertohatcheryid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `itembatchid` varchar(45) DEFAULT NULL,
  `receivedquantity` int(11) DEFAULT NULL,
  `transferquantity` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `eggtransfervehicletemprature` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eggtransfertohatcheryid` int(11) DEFAULT NULL,
  `transfertime` varchar(100) DEFAULT NULL,
  `temprature` decimal(18,3) DEFAULT NULL,
  `companyid` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employeename` varchar(200) NOT NULL,
  `emailid` varchar(200) NOT NULL,
  `mobileno` varchar(15) NOT NULL,
  `isactive` tinyint(4) NOT NULL,
  `ledgerid` int(11) DEFAULT NULL,
  `emproleids` varchar(100) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `entity` (
  `id` int(11) NOT NULL,
  `entityname` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `displayname` varchar(500) NOT NULL,
  `entitytypeid` int(11) NOT NULL,
  `pagekey` varchar(100) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  `displayorder` int(11) DEFAULT NULL,
  `description` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `additionaldesc` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `factormaster` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `convertedunitid` int(11) DEFAULT NULL,
  `baseunitid` int(11) NOT NULL,
  `factor` decimal(20,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `farmgrade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryid` int(11) NOT NULL,
  `locationid` int(11) NOT NULL,
  `grade` varchar(200) NOT NULL,
  `fromeef` int(11) NOT NULL,
  `toeef` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `farmtype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmtype` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_acknowledgementslip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slipdate` date DEFAULT NULL,
  `vehicleno` varchar(45) DEFAULT NULL,
  `vehicleweight` decimal(9,3) DEFAULT NULL,
  `receivedby` varchar(45) DEFAULT NULL,
  `materialweight` decimal(12,3) DEFAULT NULL,
  `ackno` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_acknowledgementslipdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ackid` int(11) DEFAULT NULL,
  `purchaseorderid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_billofmaterial` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bomcode` varchar(100) DEFAULT NULL,
  `itemgroupid` int(11) DEFAULT NULL,
  `itemid` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitid` int(11) DEFAULT NULL,
  `unitcost` decimal(9,3) DEFAULT NULL,
  `bomdate` date DEFAULT NULL,
  `createdby` int(11) NOT NULL,
  `isactive` tinyint(4) NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  `bomno` varchar(45) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_billofmaterialdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bomid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `quantity` decimal(9,3) NOT NULL,
  `unitcost` decimal(9,3) NOT NULL,
  `unitid` int(11) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  `materialtypeid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_feedmillsetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tolerencepercentage` decimal(9,3) DEFAULT NULL,
  `additionalcost` decimal(9,3) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `inventoryindrledgerid` int(11) DEFAULT NULL,
  `grpowithoutinvoiceledgerid` int(11) DEFAULT NULL,
  `discountledgerid` int(11) DEFAULT NULL,
  `isfifo` tinyint(4) DEFAULT NULL,
  `overheadledgerid` int(11) DEFAULT NULL,
  `applyreciptloss` tinyint(4) DEFAULT NULL,
  `lossledgerid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_indirectcostheads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resourcename` varchar(45) NOT NULL,
  `ledgerid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productionplanningid` int(11) DEFAULT NULL,
  `itemname` varchar(45) DEFAULT NULL,
  `plannedqty` decimal(9,3) DEFAULT NULL,
  `requiredqty` decimal(9,3) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `isactive` tinyint(4) DEFAULT NULL,
  `productionorderid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_production_issue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `production_issue_no` varchar(45) NOT NULL,
  `productionorder_id` int(11) NOT NULL,
  `issue_date` date NOT NULL,
  `status_id` int(11) DEFAULT NULL,
  `unitcost` decimal(30,6) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_production_issuedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `production_issue_id` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `itembatch` varchar(200) NOT NULL,
  `warehouseid` int(11) NOT NULL,
  `issue_qty` decimal(20,3) NOT NULL,
  `batch_totalcost` decimal(20,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_productionorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productionno` int(11) DEFAULT NULL,
  `typeid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `plannedqty` decimal(12,3) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `orderdate` date DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `duedate` date DEFAULT NULL,
  `employeeid` int(11) DEFAULT NULL,
  `origin` varchar(45) DEFAULT NULL,
  `customerid` int(11) DEFAULT NULL,
  `salesorderid` int(11) DEFAULT NULL,
  `costcenterid` int(11) DEFAULT NULL,
  `projectid` int(11) DEFAULT NULL,
  `actualitemcost` decimal(12,3) DEFAULT NULL,
  `actualresourcecost` decimal(12,3) DEFAULT NULL,
  `actualadditionalcost` decimal(12,3) DEFAULT NULL,
  `actualproductcost` decimal(12,3) DEFAULT NULL,
  `actualbyproductcost` decimal(12,3) DEFAULT NULL,
  `totalvariance` decimal(12,3) DEFAULT NULL,
  `completedqty` decimal(12,3) DEFAULT NULL,
  `rejectedqty` decimal(12,3) DEFAULT NULL,
  `actualclosingdate` date DEFAULT NULL,
  `overduedate` date DEFAULT NULL,
  `totalruntime` varchar(45) DEFAULT NULL,
  `totaladditionaltime` varchar(45) DEFAULT NULL,
  `totaltime` varchar(45) DEFAULT NULL,
  `journalremark` varchar(200) DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `productionorderno` varchar(30) DEFAULT NULL,
  `receipt_pendingqty` decimal(12,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_productionorderdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productionorderid` int(11) DEFAULT NULL,
  `typeid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `baseqty` decimal(12,3) DEFAULT NULL,
  `plannedqty` decimal(12,3) DEFAULT NULL,
  `pendingplannedqty` decimal(12,3) DEFAULT NULL,
  `issuemethodid` int(11) DEFAULT NULL,
  `itemstockqty` decimal(15,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_productionplanning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromdate` date DEFAULT NULL,
  `todate` date DEFAULT NULL,
  `locationid` varchar(200) DEFAULT NULL,
  `operationid` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_qualitycheck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ackid` int(11) DEFAULT NULL,
  `checkedby` varchar(45) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `qualitycheckdate` date DEFAULT NULL,
  `qualitystatus` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_qualitycheckdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qualitycheckid` int(11) DEFAULT NULL,
  `purchaseorderid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `testid` int(11) DEFAULT NULL,
  `samplequantity` decimal(9,3) DEFAULT NULL,
  `finding` varchar(45) DEFAULT NULL,
  `resultid` int(11) DEFAULT NULL,
  `remark` varchar(45) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_receipt_from_production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `production_receipt_no` varchar(45) NOT NULL,
  `productionorder_id` int(11) NOT NULL,
  `receipt_date` date NOT NULL,
  `itemid` int(11) NOT NULL,
  `receipt_qty` decimal(15,3) NOT NULL,
  `status_id` int(11) NOT NULL,
  `unit_cost` decimal(30,6) NOT NULL,
  `item_totalcost` decimal(30,6) NOT NULL,
  `itembatch` varchar(200) DEFAULT NULL,
  `towarehouse_id` int(11) NOT NULL,
  `towarehousebin_id` int(11) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `balance_qty` decimal(15,3) DEFAULT NULL,
  `packingmaterial_id` int(11) NOT NULL,
  `bag_qty` int(11) NOT NULL,
  `remaining_receiptqty` decimal(15,3) DEFAULT NULL,
  `additionalcost` decimal(30,6) DEFAULT NULL,
  `applyreciptloss` tinyint(4) DEFAULT NULL,
  `po_unit_cost` decimal(30,6) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_testmaster` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testname` varchar(45) DEFAULT NULL,
  `testtype` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_testmasterdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testmasterid` int(11) DEFAULT NULL,
  `startfrom` decimal(9,3) DEFAULT NULL,
  `endto` decimal(9,3) DEFAULT NULL,
  `resultid` int(11) DEFAULT NULL,
  `testvalue` varchar(45) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_testtemplate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_testtemplatedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testtemplateid` int(11) DEFAULT NULL,
  `testid` int(11) DEFAULT NULL,
  `testname` varchar(100) DEFAULT NULL,
  `deduction` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_weightslip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ackid` int(11) DEFAULT NULL,
  `weightslipdate` date DEFAULT NULL,
  `loadweightkg` decimal(9,3) DEFAULT NULL,
  `loadweightton` decimal(9,3) DEFAULT NULL,
  `unloadweightkg` decimal(9,3) DEFAULT NULL,
  `unloadweightton` decimal(9,3) DEFAULT NULL,
  `netweightkg` decimal(9,3) DEFAULT NULL,
  `netweightton` decimal(9,3) DEFAULT NULL,
  `intime` varchar(45) DEFAULT NULL,
  `outtime` varchar(45) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `feedmill_weightslipdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `weightslipid` int(11) DEFAULT NULL,
  `itemcode` int(11) DEFAULT NULL,
  `quantity` decimal(9,3) DEFAULT NULL,
  `weight` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `financialyeardocseries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `docseriesid` int(11) NOT NULL,
  `docname` varchar(200) NOT NULL,
  `doccode` varchar(200) NOT NULL,
  `length` int(11) NOT NULL,
  `startwith` int(11) NOT NULL,
  `endto` int(11) NOT NULL,
  `prefix` varchar(20) NOT NULL,
  `financialyearsettingid` int(11) NOT NULL,
  `default` int(11) DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `createddate` datetime DEFAULT NULL,
  `modifiedby` int(11) DEFAULT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `financialyearsetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `yearname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `yearcode` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `startfrom` date NOT NULL,
  `endto` date NOT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `createdby` int(11) NOT NULL,
  `createddate` date NOT NULL,
  `modifiedby` int(11) DEFAULT NULL,
  `modifieddate` date DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `freight` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `freightname` varchar(200) NOT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `inputledgerid` int(11) DEFAULT NULL,
  `outputledgerid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `freightdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaseinvoiceid` int(11) DEFAULT NULL,
  `freighttypeid` int(11) DEFAULT NULL,
  `freightamount` decimal(9,3) DEFAULT NULL,
  `taxid` int(11) DEFAULT NULL,
  `taxpercent` decimal(9,3) DEFAULT NULL,
  `cgstid` int(11) DEFAULT NULL,
  `cgstpercent` decimal(9,3) DEFAULT NULL,
  `cgstamount` decimal(9,3) DEFAULT NULL,
  `sgstid` int(11) DEFAULT NULL,
  `sgstpercent` decimal(9,3) DEFAULT NULL,
  `sgstamount` decimal(9,3) DEFAULT NULL,
  `igstid` int(11) DEFAULT NULL,
  `igstpercent` decimal(9,3) DEFAULT NULL,
  `igstamount` decimal(9,3) DEFAULT NULL,
  `utgstid` int(11) DEFAULT NULL,
  `utgstpercent` decimal(9,3) DEFAULT NULL,
  `utgstamount` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grpo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grpono` varchar(200) DEFAULT NULL,
  `grpodate` date NOT NULL,
  `supplierid` int(11) NOT NULL,
  `referenceno` varchar(30) DEFAULT NULL,
  `referencedate` date DEFAULT NULL,
  `purchaseorderid` int(11) DEFAULT NULL,
  `purchaseorderdate` date NOT NULL,
  `modeoftransfer` int(11) DEFAULT NULL,
  `vehiclenumber` varchar(15) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `towarehouseid` int(11) NOT NULL,
  `towarehousebinid` int(11) DEFAULT NULL,
  `discount` decimal(8,3) DEFAULT NULL,
  `servicepoid` int(11) DEFAULT NULL,
  `isservice` tinyint(4) DEFAULT NULL,
  `ackid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='GRPO';

CREATE TABLE `grpodetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grpoid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `itemname` varchar(200) DEFAULT NULL,
  `quantity` decimal(15,3) NOT NULL,
  `freequantity` decimal(15,3) DEFAULT NULL,
  `itemunitid` int(11) NOT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `itembatch` varchar(100) DEFAULT NULL,
  `unitprice` decimal(9,3) DEFAULT NULL,
  `itemdiscount` decimal(15,3) DEFAULT NULL,
  `taxpercent` int(11) DEFAULT NULL,
  `taxid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`,`quantity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hatcher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hatchername` varchar(150) NOT NULL,
  `capacity` int(11) NOT NULL,
  `locationid` int(11) NOT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `isactive` tinyint(4) DEFAULT NULL,
  `details` varchar(500) DEFAULT NULL,
  `typeid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `hatchercode` varchar(45) DEFAULT NULL,
  `usedcapacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `locationid` (`locationid`),
  KEY `warehouseid` (`warehouseid`),
  CONSTRAINT `hatcher_ibfk_1` FOREIGN KEY (`locationid`) REFERENCES `location` (`id`),
  CONSTRAINT `hatcher_ibfk_2` FOREIGN KEY (`warehouseid`) REFERENCES `warehouse` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hatcher_openingcandlingdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setterbatchid` int(11) DEFAULT NULL,
  `setterid` int(11) DEFAULT NULL,
  `hatcheryopeningid` int(11) DEFAULT NULL,
  `testdate` date DEFAULT NULL,
  `actualquantity` int(45) DEFAULT NULL,
  `samplequantity` int(45) DEFAULT NULL,
  `trueinfertile` int(11) DEFAULT NULL,
  `clears` int(11) DEFAULT NULL,
  `bloodring` int(11) DEFAULT NULL,
  `membrane` int(11) DEFAULT NULL,
  `agemortality` int(11) DEFAULT NULL,
  `fertility` decimal(9,3) DEFAULT NULL,
  `fertilitypercentage` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hatcherbatch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hatcherid` int(11) NOT NULL,
  `setterid` int(11) NOT NULL,
  `setterslotid` int(11) DEFAULT NULL,
  `setterbatchid` int(11) NOT NULL,
  `hatchercapacity` int(11) NOT NULL,
  `wasteeggs` int(11) DEFAULT NULL,
  `actualquantity` int(11) NOT NULL,
  `batchdate` date NOT NULL,
  `statusid` int(11) NOT NULL,
  `completiondate` date DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `hatcherdailytransaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hatcherid` int(11) NOT NULL,
  `hatcherbatchid` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(50) NOT NULL,
  `temperature` decimal(18,3) NOT NULL,
  `humidity` decimal(18,3) NOT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hatchery_opening_setterdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hatcheryopeningid` int(11) DEFAULT NULL,
  `setterid` int(11) DEFAULT NULL,
  `settername` varchar(200) NOT NULL,
  `itemid` int(11) NOT NULL,
  `sourceid` int(11) DEFAULT NULL,
  `plannedqty` int(11) NOT NULL,
  `transferqty` int(11) DEFAULT NULL,
  `batchqty` int(11) DEFAULT NULL,
  `crackedqty` int(11) DEFAULT NULL,
  `actualqty` int(11) DEFAULT NULL,
  `hatchingeggscost` decimal(15,3) DEFAULT NULL,
  `crackedeggscost` decimal(15,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `setterbatchdate` date DEFAULT NULL,
  `setterbatchid` int(11) DEFAULT NULL,
  `itembatch` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hatchery_openinghatcherdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setterid` int(11) DEFAULT NULL,
  `settername` varchar(200) DEFAULT NULL,
  `hatcherid` int(11) DEFAULT NULL,
  `hatchername` varchar(200) DEFAULT NULL,
  `hatchercapacity` int(45) DEFAULT NULL,
  `setterbatchquantity` int(45) DEFAULT NULL,
  `hatcherbatchquantity` int(45) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `hatcheryopeningid` int(11) DEFAULT NULL,
  `setteropeningid` int(11) DEFAULT NULL,
  `hatcherbatchdate` date DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hatchery_opningbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `settingno` int(11) DEFAULT NULL,
  `stageid` int(11) DEFAULT NULL,
  `profilename` varchar(200) DEFAULT NULL,
  `settingwhs` int(11) DEFAULT NULL,
  `openingdate` date DEFAULT NULL,
  `eggsage` int(11) DEFAULT NULL,
  `locationid` int(11) DEFAULT NULL,
  `fromwhs` int(11) DEFAULT NULL,
  `hatchingwhs` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hatcheryaccountsettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) DEFAULT NULL,
  `arinvoicegl` int(11) DEFAULT NULL,
  `arinvoicetaxid` int(11) DEFAULT NULL,
  `outsidehatcheryprocessinggl` int(11) DEFAULT NULL,
  `inventoryrevaluationgl` int(11) DEFAULT NULL,
  `fumigationglforowneggs` int(11) DEFAULT NULL,
  `fumigationglforoutsideeggs` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `locationid` (`locationid`),
  KEY `arinvoicetaxid` (`arinvoicetaxid`),
  KEY `arinvoicegl` (`arinvoicegl`),
  KEY `outsidehatcheryprocessinggl` (`outsidehatcheryprocessinggl`),
  KEY `inventoryrevaluationgl` (`inventoryrevaluationgl`),
  KEY `fumigationglforowneggs` (`fumigationglforowneggs`),
  KEY `fumigationglforoutsideeggs` (`fumigationglforoutsideeggs`),
  CONSTRAINT `hatcheryaccountsettings_ibfk_1` FOREIGN KEY (`locationid`) REFERENCES `location` (`id`),
  CONSTRAINT `hatcheryaccountsettings_ibfk_2` FOREIGN KEY (`arinvoicetaxid`) REFERENCES `tax` (`id`),
  CONSTRAINT `hatcheryaccountsettings_ibfk_3` FOREIGN KEY (`arinvoicegl`) REFERENCES `ledgers` (`id`),
  CONSTRAINT `hatcheryaccountsettings_ibfk_4` FOREIGN KEY (`outsidehatcheryprocessinggl`) REFERENCES `ledgers` (`id`),
  CONSTRAINT `hatcheryaccountsettings_ibfk_5` FOREIGN KEY (`inventoryrevaluationgl`) REFERENCES `ledgers` (`id`),
  CONSTRAINT `hatcheryaccountsettings_ibfk_6` FOREIGN KEY (`fumigationglforowneggs`) REFERENCES `ledgers` (`id`),
  CONSTRAINT `hatcheryaccountsettings_ibfk_7` FOREIGN KEY (`fumigationglforoutsideeggs`) REFERENCES `ledgers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hatcheryschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scheduledate` date NOT NULL,
  `scheduledfordate` date NOT NULL,
  `locationid` int(11) NOT NULL,
  `restperiod` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `locationid` (`locationid`),
  CONSTRAINT `hatcheryschedule_ibfk_1` FOREIGN KEY (`locationid`) REFERENCES `location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hatcheryscheduledetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hatcheryscheduleid` int(11) NOT NULL,
  `setterid` int(11) NOT NULL,
  `setterslotcapacity` int(11) NOT NULL,
  `plannedquantity` int(11) NOT NULL,
  `sourceid` int(11) NOT NULL,
  `statusid` int(11) NOT NULL,
  `createdby` int(11) DEFAULT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approveddate` date DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `requestid` int(11) DEFAULT NULL,
  `setterslotid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sourceid` (`sourceid`),
  CONSTRAINT `hatcheryscheduledetail_ibfk_3` FOREIGN KEY (`sourceid`) REFERENCES `reference` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hatcherysettings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `servicecharges` decimal(8,3) DEFAULT NULL,
  `gapinsetting` int(11) DEFAULT NULL,
  `fertilityinpercent` decimal(8,3) DEFAULT NULL,
  `settingdaysperiod` int(11) DEFAULT NULL,
  `hatchingdaysperiod` int(11) DEFAULT NULL,
  `biproductrequiredid` int(11) DEFAULT NULL,
  `warehouselocationid` int(11) DEFAULT NULL,
  `candlingdaysperiod` int(11) DEFAULT NULL,
  `overheadcostperegg` decimal(8,3) DEFAULT NULL,
  `docstandardcost` decimal(8,3) DEFAULT NULL,
  `overheadexpenseglid` int(11) DEFAULT NULL,
  `defaulteggsitemid` int(11) DEFAULT NULL,
  `defaultdocitemid` int(11) DEFAULT NULL,
  `defaultcrackedeggsitemid` int(11) DEFAULT NULL,
  `defaultbursteggsitemid` int(11) DEFAULT NULL,
  `defaultcleareggsitemid` int(11) DEFAULT NULL,
  `defaulthatcherywhforeggs` int(11) DEFAULT NULL,
  `defaulthatcherywhfordoc` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `crackedeggscost` decimal(8,3) DEFAULT NULL,
  `loadchargeperegg` decimal(8,3) DEFAULT NULL,
  `vaccinateddoccost` decimal(8,3) DEFAULT NULL,
  `costofgoodsoldledgerid` int(11) DEFAULT NULL,
  `WIPeggledgerid` int(11) DEFAULT NULL,
  `grpowithoutinvoiceledgerid` int(11) DEFAULT NULL,
  `cashledgerid` int(11) DEFAULT NULL,
  `freightledgerid` int(11) DEFAULT NULL,
  `discountledgerid` int(11) DEFAULT NULL,
  `docledgerid` int(11) DEFAULT NULL,
  `vaccineitemgroupids` varchar(200) DEFAULT NULL,
  `coldroom` int(11) DEFAULT NULL,
  `gradingwhid` int(11) DEFAULT NULL,
  `settingwhid` int(11) DEFAULT NULL,
  `hatchingwhid` int(11) DEFAULT NULL,
  `fumigationwhid` int(11) DEFAULT NULL,
  `openareawhid` int(11) DEFAULT NULL,
  `vendorwhid` int(11) DEFAULT NULL,
  `broilerChicksGroupIds` varchar(200) DEFAULT NULL,
  `medicineGroupIds` varchar(200) DEFAULT NULL,
  `fumigationGroupIds` varchar(200) DEFAULT NULL,
  `hatchingEggsGroupIds` varchar(200) DEFAULT NULL,
  `medicineconsumptionledgerid` int(11) DEFAULT NULL,
  `ctrlaccledgerid` int(11) DEFAULT NULL,
  `outsidehatchingprocessledgerid` int(11) DEFAULT NULL,
  `fumigationledgeridforownsetting` int(11) DEFAULT NULL,
  `fumigationledgeridforcustomesetting` int(11) DEFAULT NULL,
  `ARinvoiceledgerid` int(11) DEFAULT NULL,
  `ARtaxid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `defaulthatcherywhfordoc` (`defaulthatcherywhfordoc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hatchingeggscategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryname` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `hsnmaster` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter` varchar(10) NOT NULL,
  `heading` varchar(10) NOT NULL,
  `subheading` varchar(10) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `chapterid` varchar(40) NOT NULL,
  `chapterformatted` varchar(40) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `incomingoutgoingpayment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vouchermodeid` int(11) DEFAULT NULL,
  `voucherdate` date DEFAULT NULL,
  `paymentsubject` varchar(100) DEFAULT NULL,
  `paymenttypeid` int(11) DEFAULT NULL,
  `partyid` int(11) DEFAULT NULL,
  `ledgerid` int(11) DEFAULT NULL,
  `paymentamount` decimal(9,3) DEFAULT NULL,
  `byhand` tinyint(4) DEFAULT NULL,
  `narration` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `incomingoutgoingpaymentdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incomingoutgoingpaymentid` int(11) DEFAULT NULL,
  `billno` varchar(100) DEFAULT NULL,
  `billdate` date DEFAULT NULL,
  `orderno` varchar(100) DEFAULT NULL,
  `chequeno` varchar(100) DEFAULT NULL,
  `bankid` int(11) DEFAULT NULL,
  `billamount` decimal(9,3) DEFAULT NULL,
  `receiptorpaidamount` decimal(9,3) DEFAULT NULL,
  `pendingamount` decimal(9,3) DEFAULT NULL,
  `voucheramount` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemgroupid` int(11) NOT NULL,
  `itemcode` varchar(20) DEFAULT NULL,
  `itemname` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `manufacturer` varchar(200) DEFAULT NULL,
  `itemunitid` int(11) NOT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `unitcost` decimal(9,3) NOT NULL,
  `ledgerid` int(11) DEFAULT NULL,
  `isgst` tinyint(4) DEFAULT NULL,
  `materialtypeid` int(11) DEFAULT NULL,
  `hsnid` int(11) DEFAULT NULL,
  `taxcategoryid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `issalable` tinyint(4) DEFAULT NULL,
  `revenueledgerid` int(11) DEFAULT NULL,
  `seriesstartwith` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `item_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemgroupid` int(11) NOT NULL,
  `itemcode` varchar(20) DEFAULT NULL,
  `itemname` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `manufacturer` varchar(200) DEFAULT NULL,
  `itemunitid` int(11) NOT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `unitcost` decimal(9,3) NOT NULL,
  `ledgerid` int(11) DEFAULT NULL,
  `isgst` tinyint(4) DEFAULT NULL,
  `materialtypeid` int(11) DEFAULT NULL,
  `hsnid` int(11) DEFAULT NULL,
  `taxcategoryid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `itembatch_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itembatch` varchar(40) NOT NULL,
  `itembatchdate` date NOT NULL,
  `itemid` int(11) NOT NULL,
  `itemname` varchar(200) DEFAULT NULL,
  `sourcetypeid` int(11) NOT NULL,
  `frombatchid` int(11) NOT NULL,
  `quantity` decimal(8,3) NOT NULL,
  `itemunitid` int(11) NOT NULL,
  `towarehouseid` int(11) DEFAULT NULL,
  `itemcost` decimal(8,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `itemgroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupname` varchar(100) NOT NULL,
  `seriesstartwith` int(11) NOT NULL,
  `seriesprefix` varchar(20) DEFAULT NULL,
  `seriesseparator` varchar(5) DEFAULT NULL,
  `moduleid` varchar(200) DEFAULT NULL,
  `grouptypeid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `groupledgerid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `itemgroup_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupname` varchar(100) NOT NULL,
  `seriesstartwith` int(11) NOT NULL,
  `seriesprefix` varchar(20) DEFAULT NULL,
  `seriesseparator` varchar(5) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `journalentry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `disp_bucketid` int(11) DEFAULT NULL,
  `vouchertypeid` int(11) DEFAULT NULL,
  `vouchermodeid` int(11) DEFAULT NULL,
  `voucherdate` date DEFAULT NULL,
  `bankdate` date DEFAULT NULL,
  `branchid` int(11) DEFAULT NULL,
  `uservoucherno` varchar(100) DEFAULT NULL,
  `chequeno` varchar(100) DEFAULT NULL,
  `chequedate` date DEFAULT NULL,
  `byhand` varchar(100) DEFAULT NULL,
  `deletestatusid` int(11) DEFAULT NULL,
  `partyid` int(11) DEFAULT NULL,
  `partycode` varchar(100) DEFAULT NULL,
  `subledgertypeid` int(11) DEFAULT NULL,
  `dimensionid` int(11) DEFAULT NULL,
  `moduleid` int(11) DEFAULT NULL,
  `approvestatusid` int(11) DEFAULT NULL,
  `journalentrysubject` varchar(100) DEFAULT NULL,
  `addressto` varchar(45) DEFAULT NULL,
  `financialyear` varchar(45) DEFAULT NULL,
  `bankid` int(11) DEFAULT NULL,
  `transactionid` varchar(45) DEFAULT NULL,
  `narration` varchar(100) DEFAULT NULL,
  `jeno` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `inouno` varchar(200) DEFAULT NULL,
  `istds` tinyint(4) DEFAULT NULL,
  `payeebank` varchar(200) DEFAULT NULL,
  `chequeclearancedate` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `journalentry1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalentrydate` date DEFAULT NULL,
  `vouchertypeid` int(11) DEFAULT NULL,
  `narration` varchar(100) DEFAULT NULL,
  `referenceid` int(11) DEFAULT NULL,
  `moduleid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `journalentrydetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalentryid` int(11) DEFAULT NULL,
  `acledgerid` int(11) DEFAULT NULL,
  `iscostcenter` tinyint(4) DEFAULT NULL,
  `costcenterid` int(11) DEFAULT NULL,
  `projectid` int(11) DEFAULT NULL,
  `parenttype` varchar(45) DEFAULT NULL,
  `parentno` varchar(45) DEFAULT NULL,
  `billno` varchar(200) DEFAULT NULL,
  `billdate` date DEFAULT NULL,
  `billamount` decimal(30,6) DEFAULT NULL,
  `dramount` decimal(30,6) DEFAULT NULL,
  `cramount` decimal(30,6) DEFAULT NULL,
  `entrycode` varchar(45) DEFAULT NULL,
  `partyid` int(11) DEFAULT NULL,
  `entrytype` varchar(45) DEFAULT NULL,
  `loadonitemid` int(11) DEFAULT NULL,
  `subledgertypeid` int(11) DEFAULT NULL,
  `narration` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `paymentreferenceid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `journalentrydetail1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalentryid` int(11) DEFAULT NULL,
  `batchid` int(11) DEFAULT NULL,
  `locationid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `partyroleid` int(11) DEFAULT NULL,
  `partyid` int(11) DEFAULT NULL,
  `ledgerid` int(11) DEFAULT NULL,
  `creditamount` decimal(12,3) DEFAULT NULL,
  `debitamount` decimal(12,3) DEFAULT NULL,
  `narration` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `journalentryfor_amortization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalentryid` int(11) DEFAULT NULL,
  `jedate` date DEFAULT NULL,
  `batchid` int(11) DEFAULT NULL,
  `moduleid` int(11) DEFAULT NULL,
  `dramount` decimal(15,3) DEFAULT NULL,
  `cramount` decimal(15,3) DEFAULT NULL,
  `acledgerid` decimal(15,3) DEFAULT NULL,
  `weekno` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layer_batch_analysis` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `transaction_date` date NOT NULL,
  `batch_id` int(11) NOT NULL,
  `placement_date` date NOT NULL,
  `age_in_days` int(11) NOT NULL,
  `age_in_week` int(11) NOT NULL,
  `placed_qty` int(11) NOT NULL,
  `live_qty` int(11) NOT NULL,
  `today_mortality` int(11) NOT NULL,
  `cummulative_mortality` int(11) NOT NULL,
  `std_mortality` int(11) DEFAULT NULL,
  `feed_cons` decimal(15,3) NOT NULL,
  `cummulative_feed_cons` decimal(15,3) NOT NULL,
  `std_feed_consumption` decimal(15,3) DEFAULT NULL,
  `body_weight` decimal(15,3) NOT NULL,
  `std_body_weight` decimal(15,3) DEFAULT NULL,
  `total_eggs_collection` int(11) NOT NULL,
  `ce_eggs_qty` int(11) DEFAULT NULL,
  `std_eggs_collection` int(11) DEFAULT NULL,
  `item_id` int(11) NOT NULL,
  `over_head_cost` decimal(15,3) NOT NULL,
  `amortization_value` decimal(15,3) DEFAULT NULL,
  `sales_qty` int(11) NOT NULL,
  `sales_value` decimal(15,3) DEFAULT NULL,
  `balance` decimal(15,3) DEFAULT NULL,
  `bird_cost` decimal(15,3) DEFAULT NULL,
  `ce_eggs_collection_ratio` decimal(15,3) DEFAULT NULL,
  `ce_std_eggscollection_ratio` decimal(15,3) DEFAULT NULL,
  `feed_std_ratio` varchar(45) DEFAULT NULL,
  `company_id` int(11) NOT NULL,
  `feed_ratio` decimal(15,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layer_batchbridopeningbalance_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchopeningid` int(11) NOT NULL,
  `itemtype` tinyint(4) NOT NULL,
  `itemid` int(11) NOT NULL,
  `placeqty` int(11) DEFAULT NULL,
  `rate` decimal(9,3) DEFAULT NULL,
  `birdvalue` decimal(20,3) DEFAULT NULL,
  `liveqty` int(11) DEFAULT NULL,
  `mortality` int(11) DEFAULT NULL,
  `culls` int(11) DEFAULT NULL,
  `sexingerror` int(11) DEFAULT NULL,
  `cullssaleqty` int(11) DEFAULT NULL,
  `sexingerrorsaleqty` int(11) DEFAULT NULL,
  `regularsale` int(11) DEFAULT NULL,
  `totalsale` int(11) DEFAULT NULL,
  `goodeggsqty` int(11) DEFAULT NULL,
  `flooreggsqty` int(11) DEFAULT NULL,
  `othereggsqty` int(11) DEFAULT NULL,
  `totaleggs` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layer_batchconsumptionopening_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchopeningid` int(11) NOT NULL,
  `itemid` int(11) DEFAULT NULL,
  `consumptiontypeid` int(11) DEFAULT NULL,
  `consumptionitemid` int(11) DEFAULT NULL,
  `quantity` decimal(20,3) DEFAULT NULL,
  `rate` decimal(15,3) DEFAULT NULL,
  `itemvalue` decimal(20,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layer_batchfinancialopening_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchopeningid` int(11) NOT NULL,
  `birdvalue` decimal(20,3) NOT NULL,
  `consumptionvalue` decimal(20,3) NOT NULL,
  `overheadexp` decimal(9,3) NOT NULL,
  `birdliveqty` decimal(20,3) NOT NULL,
  `wipaccountbalance` decimal(20,3) NOT NULL,
  `wipperbird` decimal(20,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layer_batchlocationwiseopening_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchopeningid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `balanceqty` decimal(20,3) NOT NULL,
  `locationid` int(11) NOT NULL,
  `shedid` int(11) NOT NULL,
  `shedlineid` int(11) NOT NULL,
  `lineqty` int(11) NOT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layer_batchmerge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mergedate` date DEFAULT NULL,
  `sourcebatchid` int(11) DEFAULT NULL,
  `targetbatchid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `layer_batchmergedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchmergeid` int(11) DEFAULT NULL,
  `fromshedid` int(11) DEFAULT NULL,
  `toshedid` int(11) DEFAULT NULL,
  `transferqty` int(11) DEFAULT NULL,
  `transferid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `layer_batchopening_balance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchid` int(11) NOT NULL,
  `livebatchdate` date NOT NULL,
  `phasestatusid` int(11) NOT NULL,
  `ageindays` int(11) NOT NULL,
  `ageinweeks` decimal(9,3) NOT NULL,
  `batchplacementdate` date NOT NULL,
  `firstdaydate` date NOT NULL,
  `batchstatusid` int(11) NOT NULL,
  `expectedphasestatusid` int(11) NOT NULL,
  `statusid` int(11) NOT NULL,
  `receiptremark` varchar(200) DEFAULT NULL,
  `jeremark` varchar(200) DEFAULT NULL,
  `materialreceiptid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layer_birdcost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` varchar(45) DEFAULT NULL,
  `issueqty` decimal(20,3) DEFAULT NULL,
  `transactiondate` date DEFAULT NULL,
  `unitcost` decimal(30,6) DEFAULT NULL,
  `itemvalue` decimal(30,6) DEFAULT NULL,
  `itembatch` varchar(200) DEFAULT NULL,
  `layerbatchid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `transactionid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layer_performance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `week` tinyint(6) NOT NULL,
  `totaleggspercenthw` decimal(8,3) DEFAULT NULL,
  `pulleteggspercenthw` decimal(8,3) DEFAULT NULL,
  `mortality` decimal(8,3) DEFAULT NULL,
  `percentheweekly` decimal(8,3) DEFAULT NULL,
  `totaleggshh` decimal(8,3) DEFAULT NULL,
  `pulleteggshh` decimal(8,3) DEFAULT NULL,
  `chickshh` decimal(8,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layeramortization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amortizationdate` date DEFAULT NULL,
  `layerbatchid` int(11) DEFAULT NULL,
  `liveqty` int(11) DEFAULT NULL,
  `eggsprediction` int(11) DEFAULT NULL,
  `totaleggs` int(11) DEFAULT NULL,
  `wipvalue` decimal(20,3) DEFAULT NULL,
  `ageinweeks` int(11) DEFAULT NULL,
  `ageindays` int(11) DEFAULT NULL,
  `requiredbirdprice` decimal(20,3) DEFAULT NULL,
  `requiredbirdvalue` decimal(20,3) DEFAULT NULL,
  `amortizationvalueofbird` decimal(20,3) DEFAULT NULL,
  `amortizationno` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layerbatch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) NOT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `batchname` varchar(200) NOT NULL,
  `binid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerbatchbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `updateddate` date DEFAULT NULL,
  `layerbatchid` int(11) DEFAULT NULL,
  `layershedid` int(11) DEFAULT NULL,
  `layershedlineid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `transactionname` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layerbatchplacement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) DEFAULT NULL,
  `layerbatchid` int(11) DEFAULT NULL,
  `placementscheduleid` int(11) DEFAULT NULL,
  `firstdaydate` date DEFAULT NULL,
  `grpono` int(11) DEFAULT NULL,
  `placementdate` date DEFAULT NULL,
  `phasestatusid` int(11) DEFAULT NULL,
  `grnquantity` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerbatchplacementdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchplacementid` int(11) NOT NULL,
  `layertypeid` int(11) DEFAULT NULL,
  `layershedid` int(11) DEFAULT NULL,
  `layershedlineid` int(11) DEFAULT NULL,
  `itemid` int(11) NOT NULL,
  `placementscheduledetailid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerbatchtransfer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromlocationid` int(11) DEFAULT NULL,
  `tolocationid` int(11) DEFAULT NULL,
  `fromshedid` int(11) DEFAULT NULL,
  `transferdate` date DEFAULT NULL,
  `layerbatchid` int(11) DEFAULT NULL,
  `phasestatusid` int(11) DEFAULT NULL,
  `isshedtransfer` int(11) DEFAULT NULL,
  `transferid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layerbatchtransferdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchtransferid` int(11) DEFAULT NULL,
  `toshedid` int(11) DEFAULT NULL,
  `fromlineid` int(11) DEFAULT NULL,
  `tolineid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `nonproductivebird` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layerchicksmortality` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grpono` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `culls` int(11) DEFAULT NULL,
  `mortality` int(11) DEFAULT NULL,
  `shortage` int(11) DEFAULT NULL,
  `freeqty` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layerconsumptionissue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) DEFAULT NULL,
  `consumptionid` int(11) DEFAULT NULL,
  `issuedetailid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layerdailyconsumption` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerdailytransactionid` int(11) NOT NULL,
  `consumptiontypeid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `shedlineid` int(11) DEFAULT NULL,
  `standardconsumption` decimal(20,3) DEFAULT NULL,
  `consumptionquantity` decimal(20,3) DEFAULT NULL,
  `issuedetailid` int(11) DEFAULT NULL,
  `isherbal` tinyint(1) DEFAULT NULL,
  `layeritemid` int(11) DEFAULT NULL,
  `itemvalue` decimal(30,6) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerdailymortality` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerdailytransactionid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `shedlineid` int(11) DEFAULT NULL,
  `avgweight` decimal(9,3) DEFAULT NULL,
  `todaymortality` int(11) DEFAULT NULL,
  `mortalityreasonid` int(11) DEFAULT NULL,
  `todayculls` int(11) DEFAULT NULL,
  `cullsreasonid` int(11) DEFAULT NULL,
  `sexingerrorquantity` int(11) DEFAULT NULL,
  `issuedetailid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerdailyotherdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerdailytransactionid` int(11) NOT NULL,
  `lighton` varchar(30) DEFAULT NULL,
  `lightoff` varchar(30) DEFAULT NULL,
  `duration` decimal(9,2) DEFAULT NULL,
  `temperature` decimal(9,3) DEFAULT NULL,
  `humidity` decimal(9,3) DEFAULT NULL,
  `waterconsumption` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerdailytransaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) DEFAULT NULL,
  `shedid` int(11) NOT NULL,
  `layerbatchid` int(11) NOT NULL,
  `transactiondate` date DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approvaldate` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `placementdate` date DEFAULT NULL,
  `issueid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`,`companyid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layereggscategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryname` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layereggscollection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerbatchid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `collectiondate` date DEFAULT NULL,
  `productionstartdate` date DEFAULT NULL,
  `productionweek` int(11) DEFAULT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approvaldate` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `towarehouseid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layereggscollectiondetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eggscollectionid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `shedlineid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `stdquantity` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layereggsdistributiondetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eggscollectionid` int(11) NOT NULL,
  `shedid` int(11) DEFAULT NULL,
  `itemtypeid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `avgweight` decimal(9,3) DEFAULT NULL,
  `itembatchid` varchar(200) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `collectiondate` date DEFAULT NULL,
  `layerbatchid` int(11) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layereggstandardweightandrate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) NOT NULL,
  `fromdate` date NOT NULL,
  `todate` date NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layereggstandardweightandratedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eggstandardweightandrateid` int(11) NOT NULL,
  `weekno` smallint(6) NOT NULL,
  `standardprice` decimal(9,3) NOT NULL,
  `weight` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerfeedstandard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `standardname` varchar(200) DEFAULT NULL,
  `layernametypeid` int(11) DEFAULT NULL,
  `fromdate` date DEFAULT NULL,
  `todate` date DEFAULT NULL,
  `layeritemid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layerfeedstandarddetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerfeedstandardid` int(11) DEFAULT NULL,
  `weeknumber` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `feedconsumed` decimal(9,3) DEFAULT NULL,
  `cumulativefeed` decimal(9,3) DEFAULT NULL,
  `weeklybodyweight` decimal(9,3) DEFAULT NULL,
  `weeklygain` decimal(9,3) DEFAULT NULL,
  `phaseid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layerperformanceobjective` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) NOT NULL,
  `ageinweek` int(11) NOT NULL,
  `livability` decimal(9,3) DEFAULT NULL,
  `cumdepl` decimal(9,3) DEFAULT NULL,
  `hdppercent` decimal(9,3) DEFAULT NULL,
  `curhhp` decimal(9,3) DEFAULT NULL,
  `cumhhp` decimal(9,3) DEFAULT NULL,
  `feedperdayingm` decimal(9,3) DEFAULT NULL,
  `curfeedpereggingm` decimal(9,3) DEFAULT NULL,
  `cumfeedpereggingm` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerphase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phasesequence` int(11) NOT NULL,
  `phasename` varchar(200) NOT NULL,
  `fromweek` tinyint(4) NOT NULL,
  `toweek` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerplacementschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `schedulefordate` date NOT NULL,
  `batchid` int(11) DEFAULT NULL,
  `totalshedcapacity` int(11) NOT NULL,
  `proposedquantity` int(11) NOT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approveddate` date DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `createdby` int(11) NOT NULL,
  `requestid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerplacementscheduledetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `placementscheduleid` int(11) NOT NULL,
  `shedreadyid` int(11) DEFAULT NULL,
  `layershedid` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `proposalquantity` int(11) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerreasons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typeid` int(11) NOT NULL,
  `reason` varchar(300) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedulename` varchar(200) NOT NULL,
  `layerscheduletypeid` int(11) NOT NULL,
  `layernametypeid` int(11) DEFAULT NULL,
  `fromdate` date NOT NULL,
  `todate` date NOT NULL,
  `layeritemid` int(11) DEFAULT NULL,
  `locationids` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerscheduledetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerscheduleid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `fromweek` tinyint(4) DEFAULT NULL,
  `toweek` tinyint(4) DEFAULT NULL,
  `weeknumber` tinyint(4) DEFAULT NULL,
  `method` varchar(100) DEFAULT NULL,
  `quantity` decimal(9,3) DEFAULT NULL,
  `feedunitid` int(11) DEFAULT NULL,
  `companyid` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layerschedulelocation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layerscheduleid` int(11) NOT NULL,
  `locationid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `layersetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shedrestperiod` int(11) NOT NULL,
  `defaultfemalechickid` int(11) NOT NULL,
  `defaultfemalechickcost` int(11) NOT NULL,
  `defaultwarehouseid` int(11) NOT NULL,
  `defaultcoldroomwarehouseid` int(11) NOT NULL,
  `labourcharge` decimal(9,3) NOT NULL,
  `overheadcost` decimal(9,3) DEFAULT NULL,
  `eggspredictionperbird` int(11) DEFAULT NULL,
  `defaulttableeggsitemid` int(11) DEFAULT NULL,
  `defaultcrackedeggsitemid` int(11) DEFAULT NULL,
  `defaultdamageeggsitemid` int(11) DEFAULT NULL,
  `defaultpulleteggsitemid` int(11) DEFAULT NULL,
  `standardeggcost` decimal(9,3) DEFAULT NULL,
  `femalestandardweight` decimal(9,3) DEFAULT NULL,
  `feeditemgroupids` varchar(200) DEFAULT NULL,
  `medicineitemgroupids` varchar(200) DEFAULT NULL,
  `vaccineitemgroupids` varchar(200) DEFAULT NULL,
  `vitaminitemgroupids` varchar(200) DEFAULT NULL,
  `chicksitemgroupids` varchar(200) DEFAULT NULL,
  `eggsitemgroupids` varchar(200) DEFAULT NULL,
  `layeritemgroupids` varchar(200) DEFAULT NULL,
  `tableeggscost` decimal(9,3) DEFAULT NULL,
  `damageeggscost` decimal(9,3) DEFAULT NULL,
  `crackedeggscost` decimal(9,3) DEFAULT NULL,
  `pulleteggscost` decimal(9,3) DEFAULT NULL,
  `costofgoodsoldledgerid` int(11) DEFAULT NULL,
  `WIPledgerid` int(11) DEFAULT NULL,
  `grpowithoutinvoiceledgerid` int(11) DEFAULT NULL,
  `cashledgerid` int(11) DEFAULT NULL,
  `freightledgerid` int(11) DEFAULT NULL,
  `discountledgerid` int(11) DEFAULT NULL,
  `mortalityledgerid` int(11) DEFAULT NULL,
  `medicineledgerid` int(11) DEFAULT NULL,
  `feedledgerid` int(11) DEFAULT NULL,
  `vaccineledgerid` int(11) DEFAULT NULL,
  `vitaminledgerid` int(11) DEFAULT NULL,
  `amortizationledgerid` int(11) DEFAULT NULL,
  `ctrlaccledgerid` int(11) DEFAULT NULL,
  `inventorygainlossledgerid` int(11) DEFAULT NULL,
  `stcokledgerid` int(11) DEFAULT NULL,
  `defaultcullswhid` int(11) DEFAULT NULL,
  `amortizationcoststd` tinyint(4) DEFAULT NULL,
  `birdcoststd` tinyint(4) DEFAULT NULL,
  `amortizationcostnonprodbird` tinyint(4) DEFAULT NULL,
  `birdcostnonprodbird` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layershed` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) NOT NULL,
  `warehouseid` int(11) NOT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `shedtypeid` int(11) NOT NULL,
  `shedname` varchar(200) NOT NULL,
  `capacity` int(11) NOT NULL,
  `statusid` int(11) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `shedlengthinft` decimal(9,3) DEFAULT NULL,
  `shedwidthinft` decimal(9,3) DEFAULT NULL,
  `totalsquareft` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layershedline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layershedid` int(11) NOT NULL,
  `linename` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layershedparameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parametertypeid` int(11) NOT NULL,
  `parametername` varchar(200) NOT NULL,
  `requiredratio` varchar(15) DEFAULT NULL,
  `ismandatory` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layershedready` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layershedid` int(11) NOT NULL,
  `batchid` int(11) DEFAULT NULL,
  `batchstartdate` date DEFAULT NULL,
  `restperiod` int(11) DEFAULT NULL,
  `createdby` int(11) NOT NULL,
  `createddate` date NOT NULL,
  `finalcleaningdate` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layershedreadydetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layershedreadyid` int(11) NOT NULL,
  `parametertypeid` int(11) NOT NULL,
  `shedparameterid` int(11) NOT NULL,
  `isapplied` tinyint(4) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `layershedtype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typename` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ledgeropeningbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openingbalancedate` date DEFAULT NULL,
  `branchid` int(11) NOT NULL,
  `ledgerid` int(11) NOT NULL,
  `openingbalance` decimal(15,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  `transactiontypeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ledgeropeningbalance_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openingbalancedate` date DEFAULT NULL,
  `branchid` int(11) NOT NULL,
  `ledgerid` int(11) NOT NULL,
  `openingbalance` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ledgers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ledgercode` varchar(50) NOT NULL,
  `ledgername` varchar(300) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `lesion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lesiondetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lesionid` int(11) NOT NULL,
  `lesionname` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `licensetype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productid` int(11) NOT NULL,
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationcode` varchar(50) DEFAULT NULL,
  `locationname` varchar(200) NOT NULL,
  `moduleids` varchar(200) DEFAULT NULL,
  `branchid` int(11) DEFAULT NULL,
  `costcenterid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `locationtype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationtypename` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `materialissue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `issuedate` date NOT NULL,
  `issuetypeid` int(11) NOT NULL,
  `batchid` int(11) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `remark` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approveddate` date DEFAULT NULL,
  `fromwarehouseid` int(11) NOT NULL,
  `fromwarehousebinid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `materialissuedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `materialissueid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `itemname` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `issuequantity` decimal(15,3) NOT NULL,
  `unitcost` decimal(9,3) NOT NULL,
  `totalcost` decimal(15,3) NOT NULL,
  `itemunitid` int(11) DEFAULT NULL,
  `itembatch` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `materialmovement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) NOT NULL,
  `itembatch` varchar(100) DEFAULT NULL,
  `transactiontypeid` int(11) NOT NULL,
  `transactionid` int(11) NOT NULL,
  `transactiondate` date NOT NULL,
  `quantity` decimal(20,3) NOT NULL,
  `fromwarehouseid` int(11) DEFAULT NULL,
  `fromwarehousebinid` varchar(45) DEFAULT NULL,
  `towarehouseid` int(11) DEFAULT NULL,
  `towarehousebinid` varchar(45) DEFAULT NULL,
  `itemvalue` decimal(30,6) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `materialreceipt` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receiptdate` date NOT NULL,
  `receipttype` int(11) NOT NULL,
  `batchid` int(11) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `remark` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `createdby` int(11) NOT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approveddate` date DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `materialreceiptdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `materialreceiptid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `receiptquantity` decimal(12,3) NOT NULL,
  `unitcost` decimal(12,3) NOT NULL,
  `totalcost` decimal(12,3) NOT NULL,
  `itemunitid` int(11) DEFAULT NULL,
  `itembatch` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `batchattribute` json DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `itemname` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `towarehouse` int(11) NOT NULL,
  `towarehousebinid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `materialrequest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requestsource` int(11) DEFAULT NULL,
  `requesttarget` int(11) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `requestdate` date NOT NULL,
  `duedate` date NOT NULL,
  `remark` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `fromwarehouseid` int(11) DEFAULT NULL,
  `fromwarehousebinid` int(11) DEFAULT NULL,
  `towarehouseid` int(11) DEFAULT NULL,
  `towarehousebinid` int(11) DEFAULT NULL,
  `tobatchid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `materialrequestdetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `materialrequestid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `itemname` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itemid` (`itemid`),
  CONSTRAINT `materialrequestdetails_ibfk_1` FOREIGN KEY (`itemid`) REFERENCES `item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `materialtransfer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transfersource` int(150) NOT NULL,
  `transfertarget` int(150) NOT NULL,
  `statusid` int(11) NOT NULL,
  `duedate` date NOT NULL,
  `transferdate` date NOT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `fromwarehouseid` int(11) DEFAULT NULL,
  `fromwarehousebinid` int(11) DEFAULT NULL,
  `usagetype` varchar(150) DEFAULT NULL,
  `frombatchid` varchar(100) DEFAULT NULL,
  `tobatchid` varchar(100) DEFAULT NULL,
  `requestid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `materialtransferdetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `materialtransferid` int(11) NOT NULL,
  `towarehouseid` int(11) DEFAULT NULL,
  `towarehousebinid` int(11) DEFAULT NULL,
  `itemid` int(11) NOT NULL,
  `itemname` varchar(150) DEFAULT NULL,
  `requestedquantity` decimal(9,3) DEFAULT NULL,
  `transferedquantity` decimal(9,3) NOT NULL,
  `itemunit` varchar(50) DEFAULT NULL,
  `itembatch` varchar(1500) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `notificationhistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `moduleid` int(11) NOT NULL,
  `notificationtime` datetime NOT NULL,
  `transactiontypeid` int(11) NOT NULL,
  `transactionid` int(11) DEFAULT NULL,
  `content` varchar(3000) NOT NULL,
  `roleids` varchar(500) NOT NULL,
  `inappusers` varchar(200) DEFAULT NULL,
  `inappviewedusers` varchar(200) DEFAULT NULL,
  `occurances` varchar(100) DEFAULT NULL,
  `inapp` tinyint(4) DEFAULT NULL,
  `sms` tinyint(4) DEFAULT NULL,
  `email` tinyint(4) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notificationplaceholder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transactiontypeid` int(11) NOT NULL,
  `placeholder` varchar(200) NOT NULL,
  `propertyname` varchar(100) NOT NULL,
  `valuetype` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notificationplaceholder_bk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `placeholder` varchar(200) NOT NULL,
  `valuetype` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notificationtemplate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `moduleid` int(11) NOT NULL,
  `transactiontypeid` int(11) NOT NULL,
  `roleids` varchar(1000) NOT NULL,
  `template` varchar(3000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `userids` varchar(1000) DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `inapp` tinyint(4) DEFAULT NULL,
  `sms` tinyint(4) DEFAULT NULL,
  `email` tinyint(4) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notificationuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `userkey` varchar(50) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `organ` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organname` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `outgoingpayment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vouchermodeid` int(11) DEFAULT NULL,
  `voucherdate` date DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `ledgerid` int(11) DEFAULT NULL,
  `paymentto` int(11) DEFAULT NULL,
  `payableamount` decimal(9,3) DEFAULT NULL,
  `byhand` tinyint(4) DEFAULT NULL,
  `narration` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `outgoingpaymentdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `outgoingpaymentid` int(11) DEFAULT NULL,
  `billno` int(11) DEFAULT NULL,
  `billdate` date DEFAULT NULL,
  `orderno` varchar(100) DEFAULT NULL,
  `billamount` decimal(9,3) DEFAULT NULL,
  `paidamount` decimal(9,3) DEFAULT NULL,
  `pendingamount` decimal(9,3) DEFAULT NULL,
  `voucheramount` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `partner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partnercode` varchar(200) NOT NULL,
  `partyname` varchar(200) NOT NULL,
  `contactperson` varchar(200) DEFAULT NULL,
  `address` varchar(200) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `countryid` int(11) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `fax` varchar(15) DEFAULT NULL,
  `pan` varchar(15) DEFAULT NULL,
  `partygroup` varchar(100) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `partnercontactperson` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partnerid` int(11) NOT NULL,
  `title` varchar(20) NOT NULL,
  `personname` varchar(200) NOT NULL,
  `position` varchar(200) NOT NULL,
  `address` varchar(200) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `countryid` int(11) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `fax` varchar(15) DEFAULT NULL,
  `pan` varchar(15) DEFAULT NULL,
  `partygroup` varchar(100) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `partnerrole` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partnerid` int(11) NOT NULL,
  `partnerroleid` int(11) NOT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `party` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partyname` varchar(200) NOT NULL,
  `partyroleids` varchar(100) NOT NULL,
  `phoneno` varchar(50) DEFAULT NULL,
  `contactperson` varchar(100) DEFAULT NULL,
  `cstno` varchar(100) DEFAULT NULL,
  `gstin` varchar(100) DEFAULT NULL,
  `panno` varchar(100) DEFAULT NULL,
  `postalcode` varchar(50) DEFAULT NULL,
  `emailid` varchar(100) DEFAULT NULL,
  `shippingcontactperson` varchar(200) DEFAULT NULL,
  `shippingcontactno` varchar(50) DEFAULT NULL,
  `creditlimit` decimal(20,3) DEFAULT NULL,
  `creditperiod` int(11) DEFAULT NULL,
  `servicetaxno` varchar(50) DEFAULT NULL,
  `partygroupid` int(11) DEFAULT NULL,
  `inactiveinyear` varchar(30) DEFAULT NULL,
  `supplierledgerid` int(11) DEFAULT NULL,
  `customerledgerid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `partycode` varchar(200) DEFAULT NULL,
  `tdsid` varchar(200) DEFAULT NULL,
  `moduleid` varchar(200) DEFAULT NULL,
  `bankname` varchar(200) DEFAULT NULL,
  `accounttype` int(11) DEFAULT NULL,
  `bankbranch` varchar(200) DEFAULT NULL,
  `ifsccode` varchar(45) DEFAULT NULL,
  `accountno` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `partyaddress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partyid` int(11) NOT NULL,
  `address` varchar(500) DEFAULT NULL,
  `addresstypeid` int(11) DEFAULT NULL,
  `cityid` int(11) DEFAULT NULL,
  `stateid` int(11) DEFAULT NULL,
  `countryid` int(11) DEFAULT NULL,
  `locationcontactno` varchar(100) DEFAULT NULL,
  `pincode` varchar(50) DEFAULT NULL,
  `gstno` varchar(50) DEFAULT NULL,
  `gsttypeid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `partycontact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partyid` int(11) DEFAULT NULL,
  `mobileno` varchar(100) DEFAULT NULL,
  `faxno` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `partygroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partygroupname` varchar(150) DEFAULT NULL,
  `partyroleids` varchar(100) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `creditorsledgerid` int(11) DEFAULT NULL,
  `debitorsledgerid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `partyopeningbalance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `acledgerid` int(11) DEFAULT NULL,
  `subledgerid` int(11) NOT NULL,
  `subledgertypeids` varchar(100) DEFAULT NULL,
  `openingbalance` decimal(15,3) NOT NULL,
  `pendingbalance` decimal(15,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `transactiontypeid` int(11) DEFAULT NULL,
  `postingdate` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `partyopeningbalance_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `acledgerid` int(11) DEFAULT NULL,
  `subledgerid` int(11) NOT NULL,
  `subledgertypeids` varchar(100) DEFAULT NULL,
  `openingbalance` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `permission` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `permission1` (
  `id` int(11) NOT NULL,
  `module` varchar(200) NOT NULL,
  `submodulelevel1` varchar(200) DEFAULT NULL,
  `submodulelevel2` varchar(200) DEFAULT NULL,
  `submodulelevel3` varchar(200) DEFAULT NULL,
  `submodulelevel4` varchar(200) DEFAULT NULL,
  `pagename` varchar(200) DEFAULT NULL,
  `pagecode` varchar(100) DEFAULT NULL,
  `content` varchar(200) DEFAULT NULL,
  `permission` varchar(200) DEFAULT NULL,
  `permissiontitle` varchar(500) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `displayorder` int(11) DEFAULT NULL,
  `createddate` datetime NOT NULL,
  `modifieddate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `productioncostgrade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryid` int(11) NOT NULL,
  `locationid` int(11) NOT NULL,
  `gradeid` int(11) NOT NULL,
  `fromcost` decimal(9,3) NOT NULL,
  `tocost` decimal(9,3) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectcode` varchar(100) DEFAULT NULL,
  `projectname` varchar(300) NOT NULL,
  `validfrom` date DEFAULT NULL,
  `validto` date DEFAULT NULL,
  `isactive` smallint(4) DEFAULT NULL,
  `employeeid` int(11) DEFAULT NULL,
  `isparent` tinyint(4) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `purchase_goods_issue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `issueno` varchar(45) DEFAULT NULL,
  `issuedate` date DEFAULT NULL,
  `moduleid` int(11) DEFAULT NULL,
  `batchid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `jeid` int(11) DEFAULT NULL,
  `materialissueid` int(11) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `totalcost` decimal(15,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `purchase_goods_issuedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goodsissueid` int(11) DEFAULT NULL,
  `shedid` int(11) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `itemgroupid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `instock` decimal(15,3) DEFAULT NULL,
  `unitcost` decimal(15,3) DEFAULT NULL,
  `itemvalue` decimal(15,3) DEFAULT NULL,
  `issueqty` decimal(15,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `purchase_return` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `transactionid` int(11) DEFAULT NULL,
  `quantity` decimal(12,3) DEFAULT NULL,
  `unitcost` decimal(12,3) DEFAULT NULL,
  `amount` decimal(15,3) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `purchaseinvoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoicedate` date NOT NULL,
  `postingdate` date DEFAULT NULL,
  `duedate` date DEFAULT NULL,
  `purchaseinvoiceno` varchar(30) DEFAULT NULL,
  `vendorid` int(11) NOT NULL,
  `isservice` tinyint(4) DEFAULT NULL,
  `grpono` varchar(1000) DEFAULT NULL,
  `purchaseorderid` varchar(200) DEFAULT NULL,
  `serviceno` int(11) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `referenceno` varchar(200) DEFAULT NULL,
  `referencedate` date DEFAULT NULL,
  `creditperiod` int(11) DEFAULT NULL,
  `nettotal` decimal(12,3) NOT NULL,
  `discount` decimal(12,3) DEFAULT NULL,
  `taxtotal` decimal(12,3) DEFAULT NULL,
  `frieght` decimal(12,3) DEFAULT NULL,
  `subtotal` decimal(12,3) NOT NULL,
  `pendingtotal` decimal(12,3) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `transactiontypeid` int(11) DEFAULT NULL,
  `deliveryfromaddressid` int(11) DEFAULT NULL,
  `deliverytowarehouseid` int(11) DEFAULT NULL,
  `deliveryfromstatecode` varchar(200) DEFAULT NULL,
  `deliverytostatecode` varchar(200) DEFAULT NULL,
  `towarehousebinid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `tdsid` varchar(200) DEFAULT NULL,
  `tdsamount` decimal(12,3) DEFAULT NULL,
  `pendingtdsamount` decimal(12,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `purchaseinvoicedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaseinvoiceid` int(11) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `itemname` varchar(200) DEFAULT NULL,
  `itemunitid` int(11) DEFAULT NULL,
  `quantity` decimal(15,3) DEFAULT NULL,
  `freequantity` decimal(15,3) DEFAULT NULL,
  `unitprice` decimal(15,3) DEFAULT NULL,
  `itemdiscount` decimal(15,3) DEFAULT NULL,
  `taxid` int(11) DEFAULT NULL,
  `taxpercent` decimal(8,3) DEFAULT NULL,
  `cgstid` int(11) DEFAULT NULL,
  `cgstpercent` decimal(9,3) DEFAULT NULL,
  `cgstamount` decimal(9,3) DEFAULT NULL,
  `sgstid` int(11) DEFAULT NULL,
  `sgstpercent` decimal(9,3) DEFAULT NULL,
  `sgstamount` decimal(9,3) DEFAULT NULL,
  `igstid` int(11) DEFAULT NULL,
  `igstpercent` decimal(9,3) DEFAULT NULL,
  `igstamount` decimal(9,3) DEFAULT NULL,
  `utgstid` int(11) DEFAULT NULL,
  `utgstpercent` decimal(9,3) DEFAULT NULL,
  `utgstamount` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `itembatch` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `purchaseorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaserequestid` varchar(200) DEFAULT NULL,
  `vendorid` int(11) NOT NULL,
  `purchaseorderno` varchar(30) DEFAULT NULL,
  `podate` date NOT NULL,
  `deliverydate` date NOT NULL,
  `shipfromwarehouseid` int(11) DEFAULT NULL,
  `discount` decimal(8,3) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `potype` varchar(100) DEFAULT NULL,
  `transactiontypeid` varchar(100) DEFAULT NULL,
  `deliveryfromaddressid` int(11) DEFAULT NULL,
  `deliverytowarehouseid` int(11) DEFAULT NULL,
  `deliveryfromstatecode` varchar(200) DEFAULT NULL,
  `deliverytostatecode` varchar(200) DEFAULT NULL,
  `moduleid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `purchaseorderdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaseorderid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `chicksageindays` int(11) DEFAULT NULL,
  `quantity` decimal(15,3) NOT NULL,
  `freequantitypercent` decimal(15,3) DEFAULT NULL,
  `pendinggrpoquantity` decimal(15,3) DEFAULT NULL,
  `itemunit` int(11) NOT NULL,
  `unitprice` decimal(8,3) DEFAULT NULL,
  `itemdiscount` decimal(12,3) DEFAULT NULL,
  `taxid` int(11) DEFAULT NULL,
  `taxpercent` decimal(9,3) DEFAULT NULL,
  `cgstid` int(11) DEFAULT NULL,
  `cgstpercent` decimal(9,3) DEFAULT NULL,
  `cgstamount` decimal(15,3) DEFAULT NULL,
  `sgstid` int(11) DEFAULT NULL,
  `sgstpercent` decimal(9,3) DEFAULT NULL,
  `sgstamount` decimal(15,3) DEFAULT NULL,
  `igstid` int(11) DEFAULT NULL,
  `igstpercent` decimal(9,3) DEFAULT NULL,
  `igstamount` decimal(15,3) DEFAULT NULL,
  `utgstid` int(11) DEFAULT NULL,
  `utgstpercent` decimal(9,3) DEFAULT NULL,
  `utgstamount` decimal(15,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `purchaserequest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaserequestno` varchar(30) DEFAULT NULL,
  `requestsourceid` int(11) NOT NULL,
  `requestdate` date NOT NULL,
  `createdby` int(11) NOT NULL,
  `approvedby` int(11) DEFAULT NULL,
  `approvaldate` date DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `tobatchid` int(11) DEFAULT NULL,
  `vendorid` int(11) DEFAULT NULL,
  `materialrequireddate` date DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `purchaserequestdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaserequestid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `itemname` varchar(200) NOT NULL,
  `quantity` decimal(15,3) NOT NULL,
  `unitid` int(11) NOT NULL,
  `itemstatusid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `reference` (
  `id` int(11) NOT NULL,
  `typecode` varchar(30) NOT NULL,
  `refname` varchar(200) NOT NULL,
  `parenttypecode` varchar(20) DEFAULT NULL,
  `displayorder` int(11) DEFAULT NULL,
  `createddate` datetime NOT NULL,
  `modifieddate` datetime DEFAULT NULL,
  `deleted` tinyint(4) NOT NULL,
  `extendeddescriptioin` varchar(200) DEFAULT NULL,
  `grouptitle` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `referencetype` (
  `typecode` varchar(30) NOT NULL,
  `typename` varchar(200) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `createddate` datetime NOT NULL,
  `modifieddate` datetime DEFAULT NULL,
  PRIMARY KEY (`typecode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rolename` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `licensetypeid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `roleaccess` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) NOT NULL,
  `entityid` int(11) NOT NULL,
  `entitytypeid` int(11) NOT NULL,
  `permissions` varchar(200) NOT NULL,
  `checked` varchar(10) NOT NULL,
  `parentid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sales_return` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `transactionid` int(11) DEFAULT NULL,
  `quantity` decimal(12,3) DEFAULT NULL,
  `unitcost` decimal(12,3) DEFAULT NULL,
  `amount` decimal(15,3) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salesdelivery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salestypeid` int(11) DEFAULT NULL,
  `salesorderid` int(11) DEFAULT NULL,
  `salesdeliveryno` varchar(30) NOT NULL,
  `deliverydate` date DEFAULT NULL,
  `deliverytoaddressid` int(11) DEFAULT NULL,
  `deliverytoaddress` varchar(200) DEFAULT NULL,
  `billtoaddressid` int(11) DEFAULT NULL,
  `billtoaddress` varchar(200) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehouseaddress` varchar(200) DEFAULT NULL,
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `salespersonid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `materialissueid` int(11) DEFAULT NULL,
  `salesinvoiceid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `customerid` int(11) DEFAULT NULL,
  `discount` decimal(12,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salesdeliverydetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesdeliveryid` int(11) NOT NULL,
  `salesorderdetailid` int(11) DEFAULT NULL,
  `itemid` int(11) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `isbird` tinyint(4) DEFAULT NULL,
  `weight` decimal(12,3) DEFAULT NULL,
  `itemunitid` int(11) DEFAULT NULL,
  `itembatchid` varchar(200) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `materialissueid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `materialissuedetailid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `rate` decimal(15,3) DEFAULT NULL,
  `itemdiscount` decimal(12,3) DEFAULT NULL,
  `taxid` int(11) DEFAULT NULL,
  `taxpercent` decimal(9,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salesinvoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salestypeid` int(11) DEFAULT NULL,
  `salesinvoiceno` varchar(30) NOT NULL,
  `salesorderid` int(11) DEFAULT NULL,
  `salesdeliveryids` varchar(500) DEFAULT NULL,
  `customerid` int(11) NOT NULL,
  `contactperson` varchar(100) DEFAULT NULL,
  `salesinvoicedate` date NOT NULL,
  `referenceno` varchar(30) DEFAULT NULL,
  `referredby` int(11) DEFAULT NULL,
  `referencedate` date DEFAULT NULL,
  `deliverydate` date DEFAULT NULL,
  `deliverytoaddressid` int(11) DEFAULT NULL,
  `deliverytoaddress` varchar(200) DEFAULT NULL,
  `transactiontypeid` int(11) DEFAULT NULL,
  `billtoaddressid` int(11) DEFAULT NULL,
  `billtoaddress` varchar(200) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehouseaddress` varchar(200) DEFAULT NULL,
  `subtotal` decimal(12,3) NOT NULL,
  `pendingtotal` decimal(12,3) DEFAULT NULL,
  `discount` decimal(12,3) DEFAULT NULL,
  `roundoff` decimal(12,3) DEFAULT NULL,
  `grandtotal` decimal(12,3) NOT NULL,
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `subject` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `salespersonid` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `materialissueid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salesinvoicedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesinvoiceid` int(11) NOT NULL,
  `salesorderdetailid` int(11) DEFAULT NULL,
  `salesdeliverydetailid` int(11) DEFAULT NULL,
  `itemid` int(11) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `isbird` tinyint(4) DEFAULT NULL,
  `weight` decimal(12,3) DEFAULT NULL,
  `iscalcweight` tinyint(4) DEFAULT NULL,
  `itemunit` int(11) DEFAULT NULL,
  `unitprice` decimal(12,3) NOT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `discount` decimal(12,3) DEFAULT NULL,
  `taxid` int(11) DEFAULT NULL,
  `taxpercent` decimal(5,2) DEFAULT NULL,
  `taxtypeid` int(11) DEFAULT NULL,
  `linetotal` decimal(12,3) NOT NULL,
  `cgstid` int(11) DEFAULT NULL,
  `cgstpercent` decimal(5,2) DEFAULT NULL,
  `cgstamount` decimal(12,3) DEFAULT NULL,
  `sgstid` int(11) DEFAULT NULL,
  `sgstpercent` decimal(5,2) DEFAULT NULL,
  `sgstamount` decimal(12,3) DEFAULT NULL,
  `igstid` int(11) DEFAULT NULL,
  `igstpercent` decimal(5,2) DEFAULT NULL,
  `igstamount` decimal(12,3) DEFAULT NULL,
  `utgstid` int(11) DEFAULT NULL,
  `utgstpercent` decimal(5,2) DEFAULT NULL,
  `utgstamount` decimal(12,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salesinvoicefreight` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesinvoiceid` int(11) NOT NULL,
  `freightid` int(11) NOT NULL,
  `freightname` varchar(200) NOT NULL,
  `amount` decimal(12,3) NOT NULL,
  `taxid` int(11) DEFAULT NULL,
  `taxpercent` decimal(5,2) DEFAULT NULL,
  `taxtypeid` int(11) DEFAULT NULL,
  `cgstid` int(11) DEFAULT NULL,
  `cgstpercent` decimal(5,2) DEFAULT NULL,
  `cgstamount` decimal(12,3) DEFAULT NULL,
  `sgstid` int(11) DEFAULT NULL,
  `sgstpercent` decimal(5,2) DEFAULT NULL,
  `sgstamount` decimal(12,3) DEFAULT NULL,
  `igstid` int(11) DEFAULT NULL,
  `igstpercent` decimal(5,2) DEFAULT NULL,
  `igstamount` decimal(12,3) DEFAULT NULL,
  `utgstid` int(11) DEFAULT NULL,
  `utgstpercent` decimal(5,2) DEFAULT NULL,
  `utgstamount` decimal(12,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salesorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salestypeid` int(11) NOT NULL,
  `salesorderno` varchar(30) DEFAULT NULL,
  `customerid` int(11) DEFAULT NULL,
  `contactperson` varchar(100) DEFAULT NULL,
  `salesorderdate` date NOT NULL,
  `referenceno` varchar(30) DEFAULT NULL,
  `referredby` int(11) DEFAULT NULL,
  `referencedate` date DEFAULT NULL,
  `deliverydate` date DEFAULT NULL,
  `deliverytoaddressid` int(11) DEFAULT NULL,
  `deliverytoaddress` varchar(200) DEFAULT NULL,
  `transactiontypeid` int(11) DEFAULT NULL,
  `billtoaddressid` int(11) DEFAULT NULL,
  `billtoaddress` varchar(200) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehouseaddress` varchar(200) DEFAULT NULL,
  `subtotal` decimal(12,3) NOT NULL,
  `discount` decimal(12,3) DEFAULT NULL,
  `roundoff` decimal(12,3) DEFAULT NULL,
  `grandtotal` decimal(12,3) NOT NULL,
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `subject` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `salespersonid` int(11) DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salesorderdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesorderid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `pendingqty` decimal(12,3) DEFAULT NULL,
  `isbird` tinyint(4) DEFAULT NULL,
  `weight` decimal(12,3) DEFAULT NULL,
  `pendingweight` decimal(12,3) DEFAULT NULL,
  `iscalcweight` tinyint(4) DEFAULT NULL,
  `itemunit` int(11) DEFAULT NULL,
  `unitprice` decimal(12,3) NOT NULL,
  `discount` decimal(12,3) DEFAULT NULL,
  `taxid` int(11) DEFAULT NULL,
  `taxpercent` decimal(5,2) DEFAULT NULL,
  `taxtypeid` int(11) DEFAULT NULL,
  `linetotal` decimal(12,3) NOT NULL,
  `cgstid` int(11) DEFAULT NULL,
  `cgstpercent` decimal(5,2) DEFAULT NULL,
  `cgstamount` decimal(12,3) DEFAULT NULL,
  `sgstid` int(11) DEFAULT NULL,
  `sgstpercent` decimal(5,2) DEFAULT NULL,
  `sgstamount` decimal(12,3) DEFAULT NULL,
  `igstid` int(11) DEFAULT NULL,
  `igstpercent` decimal(5,2) DEFAULT NULL,
  `igstamount` decimal(12,3) DEFAULT NULL,
  `utgstid` int(11) DEFAULT NULL,
  `utgstpercent` decimal(5,2) DEFAULT NULL,
  `utgstamount` decimal(12,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `servicepo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `servicepono` varchar(30) DEFAULT NULL,
  `partnerid` int(11) DEFAULT NULL,
  `servicedate` date NOT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `nettotal` decimal(12,3) NOT NULL,
  `discountper` decimal(12,3) DEFAULT NULL,
  `othercharges` decimal(12,3) DEFAULT NULL,
  `roundoff` decimal(12,3) DEFAULT NULL,
  `grandtotal` decimal(12,3) NOT NULL,
  `towarehouseid` int(11) DEFAULT NULL,
  `transactiontypeid` int(11) DEFAULT NULL,
  `deliveryfromaddressid` int(11) DEFAULT NULL,
  `deliverytowarehouseid` int(11) DEFAULT NULL,
  `deliveryfromstatecode` varchar(200) DEFAULT NULL,
  `deliverytostatecode` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `servicepodetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `servicepoid` int(11) NOT NULL,
  `servicename` varchar(200) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `itemid` int(11) NOT NULL,
  `itemname` varchar(200) NOT NULL,
  `quantity` decimal(9,3) DEFAULT NULL,
  `unitid` int(11) NOT NULL,
  `rate` decimal(9,3) DEFAULT NULL,
  `discountpercent` decimal(9,3) NOT NULL,
  `discountamt` decimal(9,3) NOT NULL,
  `netamount` decimal(9,3) DEFAULT NULL,
  `taxid` int(11) NOT NULL,
  `taxpercent` decimal(9,3) DEFAULT NULL,
  `cgstid` int(11) DEFAULT NULL,
  `cgstpercent` decimal(9,3) DEFAULT NULL,
  `cgstamount` decimal(9,3) DEFAULT NULL,
  `sgstid` int(11) DEFAULT NULL,
  `sgstpercent` decimal(9,3) DEFAULT NULL,
  `sgstamount` decimal(9,3) DEFAULT NULL,
  `igstid` int(11) DEFAULT NULL,
  `igstpercent` decimal(9,3) DEFAULT NULL,
  `igstamount` decimal(9,3) DEFAULT NULL,
  `utgstid` int(11) DEFAULT NULL,
  `utgstpercent` decimal(9,3) DEFAULT NULL,
  `utgstamount` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `setter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `settername` varchar(300) NOT NULL,
  `capacity` int(11) NOT NULL,
  `locationid` int(11) NOT NULL,
  `warehouseid` int(11) NOT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `typeid` int(11) DEFAULT NULL,
  `machinedetails` varchar(500) DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `settercode` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `locationid` (`locationid`),
  KEY `warehouseid` (`warehouseid`),
  CONSTRAINT `setter_ibfk_1` FOREIGN KEY (`locationid`) REFERENCES `location` (`id`),
  CONSTRAINT `setter_ibfk_2` FOREIGN KEY (`warehouseid`) REFERENCES `warehouse` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `setterbatch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setterid` int(11) DEFAULT NULL,
  `scheduleid` int(11) DEFAULT NULL,
  `detailsid` int(11) DEFAULT NULL,
  `breederbatchid` int(11) DEFAULT NULL,
  `sourceid` int(11) DEFAULT NULL,
  `sourcedeliveryid` int(11) DEFAULT NULL,
  `availablequantity` int(11) DEFAULT NULL,
  `crackedquantity` int(11) DEFAULT NULL,
  `actualquantity` int(11) DEFAULT NULL,
  `batchdate` date DEFAULT NULL,
  `partycode` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `completiondate` datetime DEFAULT NULL,
  `itembatch` varchar(100) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  `setterslotid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `setterdailytransaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setterbatchid` int(11) NOT NULL,
  `setterid` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `time` varchar(50) NOT NULL,
  `temperature` decimal(18,3) NOT NULL,
  `humidity` decimal(18,3) NOT NULL,
  `rotationid` int(11) NOT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `setterslots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setterid` int(11) NOT NULL,
  `slotname` varchar(100) NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `countryid` int(11) DEFAULT NULL,
  `statecode` varchar(45) DEFAULT NULL,
  `statename` varchar(100) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `stategstcode` varchar(100) DEFAULT NULL,
  `isunionterritory` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `stockadjustment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `warehouseid` int(11) DEFAULT NULL,
  `warehousebinid` int(11) DEFAULT NULL,
  `adjustmenttypeid` int(11) DEFAULT NULL,
  `instock` decimal(15,3) DEFAULT NULL,
  `quantity` decimal(12,3) DEFAULT NULL,
  `unitcost` decimal(12,3) DEFAULT NULL,
  `amount` decimal(15,3) DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `supervisorkm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` int(11) DEFAULT NULL,
  `employeeid` int(11) DEFAULT NULL,
  `travalingdate` date DEFAULT NULL,
  `vehicleno` varchar(45) DEFAULT NULL,
  `openingkm` decimal(9,3) DEFAULT NULL,
  `closingkm` decimal(9,3) DEFAULT NULL,
  `totalkm` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `supervisorkmcharge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` int(11) DEFAULT NULL,
  `employeeid` int(11) DEFAULT NULL,
  `chargedate` date DEFAULT NULL,
  `fromdate` date DEFAULT NULL,
  `todate` date DEFAULT NULL,
  `statusid` int(11) DEFAULT NULL,
  `rate` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `supervisorkmchargedetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supervisorkmchargeid` int(11) DEFAULT NULL,
  `supervisorkmid` int(11) DEFAULT NULL,
  `jeid` int(11) DEFAULT NULL,
  `supervisorkmdate` date DEFAULT NULL,
  `km` decimal(9,3) DEFAULT NULL,
  `deductedkm` decimal(9,3) DEFAULT NULL,
  `finalkm` decimal(9,3) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `symptoms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organid` int(11) NOT NULL,
  `lesionid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `symptomsdetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `symptomsid` int(11) NOT NULL,
  `symptomsname` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t` (
  `txt` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tax` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taxcode` varchar(50) NOT NULL,
  `taxname` varchar(200) NOT NULL,
  `taxpercent` decimal(8,3) NOT NULL,
  `taxtypeid` int(11) NOT NULL,
  `combinedtaxes` varchar(200) DEFAULT NULL,
  `inputledgerid` int(11) DEFAULT NULL,
  `outputledgerid` int(11) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `temp1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `temp2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupname` varchar(200) DEFAULT NULL,
  `seriesstartwith` varchar(200) DEFAULT NULL,
  `seriesseparator` varchar(200) DEFAULT NULL,
  `seriesprefix` varchar(200) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `test5` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(45) NOT NULL,
  `lname` varchar(45) NOT NULL,
  `city` varchar(50) NOT NULL,
  `mark` decimal(9,3) NOT NULL,
  `companyid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `treatmenttype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmenttype` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `gender` varchar(1) NOT NULL,
  `brithdate` date DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `city` varchar(200) NOT NULL,
  `state` varchar(200) NOT NULL,
  `countryid` int(11) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `roleid` int(11) NOT NULL,
  `companyid` int(11) NOT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `locked` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `imei` varchar(20) DEFAULT NULL,
  `pwd` blob NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `locked` tinyint(4) DEFAULT NULL,
  `createdby` int(11) NOT NULL,
  `createddate` date NOT NULL,
  `modifiedby` int(11) DEFAULT NULL,
  `modifieddate` date DEFAULT NULL,
  `accesstoken` text,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_keyshortcuts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) NOT NULL,
  `key` varchar(45) NOT NULL,
  `pagekey` varchar(200) NOT NULL,
  `pagename` varchar(200) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `userlicense` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `companysubscriptionid` int(11) NOT NULL,
  `roleid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `vehicledetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eggtransfertohatcheryid` varchar(45) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `temprature` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `warehouse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationid` int(11) NOT NULL,
  `moduleid` varchar(200) NOT NULL,
  `warehousecode` varchar(200) NOT NULL,
  `warehousename` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `shiptoname` varchar(200) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `cityid` int(11) DEFAULT NULL,
  `stateid` int(11) DEFAULT NULL,
  `countryid` int(11) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `gln` varchar(50) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `companyid` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `locationid` (`locationid`),
  CONSTRAINT `warehouse_ibfk_1` FOREIGN KEY (`locationid`) REFERENCES `location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `warehousebin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `warehouseid` int(11) NOT NULL,
  `bincode` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `binname` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `isdefault` tinyint(4) DEFAULT NULL,
  `displayorder` tinyint(4) DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `waterfacility` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facility` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `waterparameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `unit` varchar(200) NOT NULL,
  `stdspecification` varchar(200) NOT NULL,
  `companyid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


