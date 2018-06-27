var sendFile = function(res, filepath)
{
	const root = {root : __dirname + "/../public/front"};
	res.sendFile(filepath, root, function(err)
	{
		if (err)
		{
			console.log(err);
		}
	});
}

exports.sendFile = sendFile;
