# curly bracket at the beginning of the file to to open an object
1 i\
{

# any semi-colon becomes a comma
s/;$/,/g

# any selector (followed by a curly bracket) becomes a property
s/(.+) \{/\t"\1": {/

# any property (starting with 2 spaces) becomes a nested property
s/  (.+):/\t\t"\1":/

# replace any comma after a closing angle bracket
# that is followed by any other closing bracket
/\],$/{
	$!{ N
		s/(\]),(\n\s*[]}])/\1\2/
		t sub-done-square
		P
		D
		:sub-done-square
	}
}

# curly braces (ends of the selector body) need a comma
# to become nested objects
# each but the last one
/\}$/{
	$!{ N
		s/\}\n/},\n/
		t sub-done-curly
		P
		D
		:sub-done-curly
	}
}
# and a tab for pretty print
s/\}/\t}/

# curly bracket at the end of the file to close the object
$ a\
}
