module.exports = app => {


    const ReportPost = require("../controllers/ReportPost");

    let router = require("express").Router();

    router.post("/Report_a_post", ReportPost.ReportPost);
    router.post("/delete_Report_post", ReportPost.UnReportPost);
    router.post("/view_Reports_post", ReportPost.ViewReportPost);
    router.post("/view_post_Reports", ReportPost.ViewPostReports);
    router.post("/View_postReports", ReportPost.ViewPostReports);
    router.post("/View_postReports_All", ReportPost.ViewPostReportsAll);

    app.use("/Report", router);
};
