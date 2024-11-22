const main = (req, res, next) => {
	console.log(`${req.method} ${req.originalUrl}`);

	res.json({
		status: 'success',
		data: { message: 'index controller' }
	});
};

module.exports = { main };
