# curly bracket at the beginning of the file to to open an object
# 1i\/\{\n/

# curly bracket at the end of the file to close the object
# i\a

# any semi-colon becomes a comma
s/;$/,/g

# any selector (folowed by a curly bracket) becomes a property
s/(.+) \{/\t"\1": {/

# any property (starting with 2 spaces) becomes a nested property
s/  (.+):/\t\t"\1":/

# curly braces (ends of the selector body) need a comma
# to become nested objects
s/\}$/\t},/


