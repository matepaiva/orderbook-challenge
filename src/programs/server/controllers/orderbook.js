module.exports = {
    start,
    rebalance,
};

async function start(req, res, next) {
    try {
        const { params } = res.locals;

        res.json({ route: 'start', params });
    } catch (error) {
        next(error);
    }
}

async function rebalance(req, res, next) {
    try {
        const { params } = res.locals;

        res.json({ route: 'rebalance', params });
    } catch (error) {
        next(error);
    }
}
