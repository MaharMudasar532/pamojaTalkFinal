const Ads = require('../models/ads.js');

exports.Add = async (req, res) => {
    try {
        let photo = '';

        if (req.file) {
            const { path } = req.file;
            photo = path;
        }

        const newAd = new Ads({
            image: photo,
            link: req.body.link,
            created_at: Date.now(),
            updated_at: Date.now(),
        });

        const result = await newAd.save();

        res.json({
            message: "Ad's added Successfully!",
            status: true,
            result,
        });
    } catch (err) {
        res.json({
            message: err.message,
            status: false,
        });
    }
};

exports.addImage = async (req, res) => {
    if (!req.body.ads_id) {
        res.json({
            message: "id is required",
            status: false,
        });
    } else {
        try {
            const ad = await Ads.findById(req.body.ads_id);

            if (ad) {
                let photo = ad.image;
                const { ads_id } = req.body;

                if (req.file) {
                    const { path } = req.file;
                    photo = path;
                }

                ad.image = photo;
                await ad.save();

                const data = await Ads.findById(req.body.ads_id);

                res.json({
                    message: "Ad Image added Successfully!",
                    status: true,
                    result: data,
                });
            } else {
                res.json({
                    message: "Not Found",
                    status: false,
                });
            }
        } catch (err) {
            console.error(err);
            res.json({
                message: "Try Again",
                status: false,
                error: err.message,
            });
        }
    }
};

exports.Get = async (req, res) => {
    try {
        const ad = await Ads.findById(req.body.ads_id);

        if (ad) {
            res.json({
                message: "Ad's Data",
                status: true,
                result: ad,
            });
        } else {
            res.json({
                message: "Not Found",
                status: false,
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            message: "Try Again",
            status: false,
            error: err.message,
        });
    }
};

exports.GetAll = async (req, res) => {
    try {
        const data = await Ads.find().countDocuments();
        const limit = 10;
        const page = req.body.page;
        let result;

        if (!page || !limit) {
            result = await Ads.find().sort({ created_at: -1 });
        }

        if (page && limit) {
            const skip = (parseInt(page) - 1) * limit;
            result = await Ads.find().sort({ created_at: -1 }).skip(skip).limit(limit);
        }

        res.json({
            message: "Ad's Data",
            status: true,
            count: data,
            result,
        });
    } catch (err) {
        res.json({
            message: "Could not fetch",
            status: false,
            error: err.message,
        });
    }
};

exports.Update = async (req, res) => {
    if (!req.body.ads_id) {
        res.json({
            message: "id is required",
            status: false,
        });
    } else {
        try {
            const ad = await Ads.findById(req.body.ads_id);

            if (ad) {
                const oldLink = ad.link;
                const { ads_id, link } = req.body;

                if (link === undefined || link === '') {
                    ad.link = oldLink;
                } else {
                    ad.link = link;
                }

                if (req.file) {
                    const { path } = req.file;
                    ad.image = path;
                }

                await ad.save();
                const data = await Ads.findById(req.body.ads_id);

                res.json({
                    message: "Ad Updated Successfully!",
                    status: true,
                    result: data,
                });
            } else {
                res.json({
                    message: "Not Found",
                    status: false,
                });
            }
        } catch (err) {
            console.error(err);
            res.json({
                message: "Try Again",
                status: false,
                error: err.message,
            });
        }
    }
};

exports.Delete = async (req, res) => {
    try {
        const ad = await Ads.findById(req.body.ads_id);

        if (ad) {
            const data = await Ads.findByIdAndDelete(req.body.ads_id);

            res.json({
                message: "Ad Deleted Successfully!",
                status: true,
                result: data,
            });
        } else {
            res.json({
                message: "Not Found",
                status: false,
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            message: "Try Again",
            status: false,
            error: err.message,
        });
    }
};



