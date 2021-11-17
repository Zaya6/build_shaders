# build_shaders
A simple bash script to convert shaders into header files for inclusion with your program binary. C/C++

## Defaults
The script has some reasonable settings it defaults to. Of course these can be changed easily by editing the file or through parameters passed to it when calling it. These are at the top of the file.

```bash
SOURCE="${1:-shaders}" # source directory to find shaders
DESTINATION="${2:-include/shaders}" # Output directory
MAKE_DESTINATION="${3:-true}"
USE_COLOR="${4:-true}"
```

### SOURCE
The script looks for shaders inside "shaders/" and reads each file by line and turns it into a C concatenated string. You can change this when calling like this:

```bash
$ ./build_shaders.sh path/to/your/shaders
```
### DESTINATION

The resulting files are output to "include/shaders/" as header files with the appropriate #defines. You can change the source location when calling like this: 
```bash
$ ./build_shaders.sh path/to/your/shaders path/to/destination
```
The file name is important as the script uses it for the basis of a number of things. So a shader named:

```
basic.frag
```
will output a header file named:
```
basic_frag.h
```

with the #defines

```c
#ifndef SHADER_BASIC_FRAG
#define SHADER_BASIC_FRAG
```
and the variable
```c
static const char* shader_src_basic_frag
```

### etc.
Likewise you can change the default behavior of MAKE_DESTINATION, which tells it to make the output directory if it doesn't exist. Otherwise it will exit and print an error. And you can change USE_COLORS, which is helpful when using this with VS Code, IDEs, or build tools to keep the output from looking like garbage.

Here's how it can look when passing all parameters
```bash
$ ./build_shaders.sh path/to/your/shaders path/to/destination false false
```

### CMake
Here's a helpful snippit to integrate into Cmake to have it convert your shaders as a step when building your project

```cmake
add_custom_target(shaders ALL 
    bash ${PROJECT_SOURCE_DIR}/build_shaders.sh 
    ${PROJECT_SOURCE_DIR}/shaders 
    ${PROJECT_SOURCE_DIR}/include/shaders
    true
    false
    )
```
## Example 

Given the file:
```
project/shaders/basic.vert
```
with the content of:
```glsl
#version 330

attribute vec4 position;

void main() {

   gl_Position = vec4(position.xyz, 1.0);

}
// new line at end!
```
the resulting header will be:
```
project/include/shaders/basic_vert.h
```
with the content of:
```glsl
#ifndef SHADER_BASIC_VERT
#define SHADER_BASIC_VERT

static const char* shader_src_basic_vert = ""
"#version 330\n"
"\n"
"attribute vec4 position;\n"
"\n"
"void main() {\n"
"\n"
"gl_Position = vec4(position.xyz, 1.0);\n"
"\n"
"}\n"
"";
#endif

```
empty lines are perserved to aid in debugging.

## You Should know...
Always put a newline at the end of your shader code or the ending brace "}" will be excluded, or whatever else you have at the end. This seems to be a behavior of the read command which uses "\n" as the delimiter to return a line. No delimiter, no returned line.
