// Apply various colors to text via ansi escape codes
package color

import fatihcolor "github.com/fatih/color"

var Green = fatihcolor.New(fatihcolor.FgHiGreen).SprintFunc()
var Magenta = fatihcolor.New(fatihcolor.FgHiMagenta).SprintFunc()
var Red = fatihcolor.New(fatihcolor.FgHiRed).SprintFunc()
