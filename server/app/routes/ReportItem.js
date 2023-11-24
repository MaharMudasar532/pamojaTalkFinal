module.exports = app => {


    const ReportItem = require("../controllers/ReportItem");

    let router = require("express").Router();

    router.post("/Report_an_item", ReportItem.ReportItem);
    router.post("/delete_Report_item", ReportItem.UnReportItem);
    router.post("/view_Reports_Item",ReportItem.ViewReportItem );
    router.post("/view_Item_Reports",ReportItem.ViewItemReports );
    router.post("/ViewItemReports",ReportItem.ViewItemReports );
    router.post("/ViewItemReportsAll",ReportItem.ViewItemReportsAll );

    app.use("/Report", router);
};
