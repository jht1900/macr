
var nunjucks 			= require('nunjucks');
var fs 						= require('fs');
var mkdirp 				= require('mkdirp');
var yargs 				= require('yargs').argv;

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./src/templates'));

var g_prefix = 'https://github.com/jht1900/macr/blob/master/';

render_path('../../books', 'README.md', g_prefix + '/books/');
render_path('../../director-boxes', 'README.md', g_prefix + '/director-boxes/');

// ---------------------------------------------------------------------------------------
function render_path(path, outfile, prefix) {
	var items = [];
	//var path = '../../books';

	visit_files_at_path(path, function (finfo) {
		//console.log('finfo.fullpath='+finfo.fullpath+' finfo.filename='+finfo.filename);
		items.push( { title: finfo.filename, link: prefix + finfo.filename});
	});

	render_for_info( { items: items }, './src/templates/image_list.njk', path + '/' + outfile);
}

// ---------------------------------------------------------------------------------------
function render_for_info(info, infile, outfile ) {
	var str = fs.readFileSync(infile, 'utf8');
	if (! str) {
		console.log('readFileSync failed infile='+infile);
		return;
	}
	var res = env.renderString( str, info );
	fs.writeFileSync(outfile, res, 'utf8');
}

// ---------------------------------------------------------------------------------------
function visit_files_at_path(in_path, func) {
	var filenames = fs.readdirSync(in_path);
	for (var index = 0; index < filenames.length; index++) {
		var filename = filenames[index];
		if (filename.substr(0,1) == '.') continue;
		var fullpath = in_path + '/' + filename;
		var stat = fs.statSync( fullpath );
		if (stat.isDirectory()) {
			var dir_filenames = fs.readdirSync(fullpath);
			for (var dindex = 0; dindex < dir_filenames.length; dindex++) {
				var dname = dir_filenames[dindex];
				if (dname.substr(0,1) == '.') continue;
				filenames.push( filename + '/' + dname );
			}
		}
		else {
			func({fullpath: fullpath, filename: filename});;
		}
	}
}

// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
