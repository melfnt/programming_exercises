
var tbl_node;
var exercises;
var selected_count = 0;

function onload ()
{
	tbl_node = document.getElementById ("table_exercise");
	exercises = [];
	fetch_latex_exercises_file ( "exercises.tex", add_exercise, null );
	
	document.getElementById ("select_all").addEventListener ("click", select_all);
	document.getElementById ("generate").addEventListener ("click", generate);
	
}

function add_exercise ( exercise, id )
{
	var row_node = document.createElement ("tr");
	row_node.class = "exercise_row";
	
	var check_td = document.createElement ("td");
	var check_node = document.createElement ("input");
	check_node.type = "checkbox";
	check_node.className = "exercise_checkbox";
	check_node.id = "check_"+id;
	check_node.addEventListener ("click", exercise_selected);
	row_node.appendChild (check_td);
	check_td.appendChild ( check_node );
	
	var id_td = document.createElement ("td");
	var id_txt = document.createTextNode (id);
	row_node.appendChild (id_td);
	id_td.appendChild ( id_txt );
	
	var topic_td = document.createElement ("td");
	var topic_txt = document.createTextNode (exercise.topic);
	row_node.appendChild (topic_td);
	topic_td.appendChild ( topic_txt );
	
	var level_td = document.createElement ("td");
	var level_txt = document.createTextNode (exercise.level);
	row_node.appendChild (level_td);
	level_td.appendChild ( level_txt );

	var text_td = document.createElement ("td");
	var text_txt = document.createTextNode (exercise.text);
	row_node.appendChild (text_td);
	text_td.appendChild ( text_txt );
		
	tbl_node.appendChild (row_node);
	exercises.push (exercise);
}

function select_all ()
{
	var checkboxes = document.getElementsByClassName ("exercise_checkbox");
	if ( this.checked )
	{
		for ( let i in checkboxes )
		{
			checkboxes[i].checked = true;
			selected_count = exercises.length;
		}
	}
	else
	{
		for ( let i in checkboxes )
		{
			checkboxes[i].checked = false;
			selected_count = 0;
		}
	}
}

function exercise_selected ()
{
	if ( this.checked )
	{
		selected_count++;
		if ( selected_count == exercises.length )
		{
			document.getElementById ("select_all").checked = true;
		}
	}
	else
	{
		selected_count--;
		document.getElementById ("select_all").checked = false;		
	}
}

function generate ()
{
	var checkboxes = document.getElementsByClassName ("exercise_checkbox");
	var exercises_string = _LATEX_HEADER + "\n";
	for ( let i in checkboxes )
	{
		if ( checkboxes[i].checked )
		{
			//~ console.log (checkboxes[i]);
			var id = checkboxes[i].id.split ("_")[1];
			id = id*1;
			//~ console.log ("selected_exercise",exercises[id]);
			
			var str = exercise_to_latex ( exercises[id] );
			//~ console.log ("string", str)
			exercises_string += str;
		}
	}
	
	//~ console.log ("exercise_string", exercises_string);
	//~ console.log ("ecoded:", encodeURIComponent(exercises_string));
	
	exercises_string = exercises_string + "\n" + _LATEX_FOOTER;
	
	document.getElementById("latex_snippet").innerText= encodeURIComponent(exercises_string);
}

window.addEventListener ("load", onload);

