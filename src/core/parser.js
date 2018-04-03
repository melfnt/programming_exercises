
const _BEGIN_EXERCISE_MARK = "\\begin{exercise}";
const _END_EXERCISE_MARK = "\\end{exercise}";
const _BEGIN_SOLUTION_MARK = "\\begin{solution}";
const _END_SOLUTION_MARK = "\\end{solution}";

//TODO: extract header and footer from parsed latex file
const _LATEX_HEADER = "\\documentclass{article} \n \
\n \
\\usepackage[utf8]{inputenc}\n \
\n \
%environment solution\n \
\\usepackage{verbatim}\n \
\\newenvironment{solution}{\\verbatim}{\\endverbatim}\n \
\n \
%environment exercise\n \
\\newenvironment{exercise}[3]{%\n \
\\noindent \\textbf{\\footnotesize difficoltà #2}\n \
#3 \\\n \
}{}\n \
\n \
\n \
\\begin{document}\n \
\n \
\\title{Esercizi FTP}\n \
\\author{Lucio Messina e Ludovica Pannitto}\n \
\\maketitle\n"

const _LATEX_FOOTER = "\n\\end{document}\n"

function fetch_latex_exercises_file ( filename, callback_per_exercise, callback_then )
{
	var req = new XMLHttpRequest();
	req.addEventListener("load", function () 
	{
		var source_str = this.responseText;
		var count = 0;
		
		var idx = 0;
		while ( idx < source_str.length )
		{
			
			source_str = source_str.substring ( idx );
			
			var start_exercise = source_str.indexOf ( _BEGIN_EXERCISE_MARK );
			var   end_exercise = source_str.indexOf (   _END_EXERCISE_MARK );
			
			//~ console.log ("start_exercise",start_exercise,"end_exercise",end_exercise);
			
			if ( start_exercise >= 0 && end_exercise >= 0 )
			{
				var exercise_body = source_str.substring ( start_exercise + _BEGIN_EXERCISE_MARK.length, end_exercise );
				var ex = parse_exercise ( exercise_body);
				if (ex!=null)
				{
					callback_per_exercise (ex,count);
				}
			}
			
			idx = end_exercise + _END_EXERCISE_MARK.length;
			count = count + 1;
			
		}		
		console.log ("loaded",count,"exercises");
		//~ callback_then ();
		
	} );
	req.addEventListener("error", function (e) 
	{
		console.log ("ERROR",e);
	} );
	req.overrideMimeType("text/plain");
	req.open("GET", filename);
	req.send();
}

function parse_exercise ( exercise_body )
{
	var a = exercise_body.indexOf ("{",0);
	var u = exercise_body.indexOf ("}",a);
	var b = exercise_body.indexOf ("{",u);
	var v = exercise_body.indexOf ("}",b);
	var c = exercise_body.indexOf ("{",v);
	var w = exercise_body.indexOf ("}",c);
	var d = exercise_body.indexOf (_BEGIN_SOLUTION_MARK);
	var z = exercise_body.indexOf (  _END_SOLUTION_MARK);
	var exercise = null;
	if ( a>=0 && b>=0 && c>=0 && d>=0 && u>=0 && v>=0 && w>=0 && z>=0)
	{
		var topic = exercise_body.substring ( a+1, u );
		var level = exercise_body.substring ( b+1, v );
		var text = exercise_body.substring ( c+1, w );
		text.replace ("/\\\\/g", "\n");
		var solution = exercise_body.substring ( d+_BEGIN_SOLUTION_MARK.length, z );
		
		exercise = { "topic":topic, "level":level*1, "text":text, "solution":solution};
	}
	else
	{
		console.log ("malformed exercise");
		console.log (exercise_body);
	}	
	return exercise;
}


//~ \begin{exercise}{for}{1}{Scrivere un programma che stampi 1000 volte "non metterò le puntine sulla sedia della maestra".}
//~ \begin{solution}
//~ var i;
//~ for ( i=0; i<100; i=i+1 )
//~ {
    //~ writeln ("non metterò le puntine sulla sedia della maestra");
//~ }
//~ \end{solution}
//~ \end{exercise}
function exercise_to_latex ( ex )
{
	var str = _BEGIN_EXERCISE_MARK + "{" + ex.topic + "}{" + ex.level + "}{" + ex.text + "}\n"
	        + _BEGIN_SOLUTION_MARK + ex.solution + _END_SOLUTION_MARK + "\n"
	        + _END_EXERCISE_MARK + "\n";
	return str; 
}
