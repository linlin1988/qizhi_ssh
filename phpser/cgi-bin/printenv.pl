#!c:\perl\bin\perl.exe
##
##  printenv -- demo CGI program which just prints its environment
##


print "Content-type: text/html\n\n";
print "<pre>*** Please define header of file *.pl or *.cgi with<b>
&nbsp;&nbsp;&nbsp; #!c:\\perl\\bin\\perl.exe</b>\n\n\n";
foreach $var (sort(keys(%ENV))) {
    $val = $ENV{$var};
    $val =~ s|\n|\\n|g;
    $val =~ s|"|\\"|g;
    print "${var}=\"${val}\"\n";
}

