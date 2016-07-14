var fs =  require('fs');
var readline = require('readline');
var stream = require('stream');
var ins = fs.ReadStream('Indicators.csv');
var header = [];
var cntryInd, indicator;
var a = 0, b = 0;
var All_Asian = ["Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Myanmar", "Cambodia", "China", "India", "Indonesia", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Nepal",
"Oman", "Pakistan", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"];
var out1 = fs.WriteStream('First.json');
var out2 = fs.WriteStream('Second.json');
function writeToFile(current,outstream,c)
{
    var object = {};
    for(var i=0;i<current.length;i++)
    {
      object[header[i]] = current[i];
    }
    if(c==1)
    {
      outstream.write(JSON.stringify(object));
    }
    else
    {
      outstream.write(","+JSON.stringify(object));
    }
    c++;
    return c;
}
var r = readline.createInterface({
    input: ins,
    terminal: false
  });
r.on('line', function(line)
{
 if(a==0)
  {
    header=line.split(",");
    cntryInd = header.indexOf("CountryName");
    indicator = header.indexOf("IndicatorCode");
    out1.write("[");
    out2.write("[");
    a++;
    b++;
  }
 else
  {
        var current = line.replace('"Population,','"Population').replace('"Population ,','"Population').split(",");
        if(current[cntryInd]==="India" && (current[indicator]==="SP.RUR.TOTL.ZS" || current[indicator]==="SP.URB.TOTL.IN.ZS"))
        {

          a = writeToFile(current,out1,a);
        }
        else if(current[indicator]==="SP.RUR.TOTL" || current[indicator]==="SP.URB.TOTL")
        {
          var condition = false;
          for(var i=0;i<All_Asian.length;i++)
            {
              if(current[cntryInd]===All_Asian[i])
              {
                condition = true;
                break;
              }
            }
            if(condition)
             {
               b = writeToFile(current,out2,b);
               console.log(b);
             }
          }
    }
}).on('close', () => {
 console.log(a+" "+b);
 console.log(All_Asian.length);
 out1.write("]");
 out2.write("]");
});
