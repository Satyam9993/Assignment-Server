exports.generateLast12MonthData = (model) => {
    return new Promise((resolve, reject) => {
        const last12MonthData = [];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);

        let promises = [];

        for (let i = 0; i < 12; i++) {
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, currentDate.getDate());
            const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());

            const monthYear = endDate.toLocaleString('default', { month: 'short', year: 'numeric' });

            promises.push(
                model.countDocuments({
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }).then(count => {
                    last12MonthData.unshift({ month: monthYear, count });
                })
            );
        }

        Promise.all(promises)
            .then(() => resolve(last12MonthData))
            .catch(err => reject(err));
    });
};
