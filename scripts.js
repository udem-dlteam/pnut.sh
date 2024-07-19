document.addEventListener("DOMContentLoaded", function() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Get the text from the sum.c file to display in the editor
    fetch('sum.c').then(response => response.text()).then(text => {
        const codeTextArea = document.getElementById('code');
        codeTextArea.value = text;

        // Initialize CodeMirror on the textarea with C syntax highlighting and Dracula theme
        const codeEditor = CodeMirror.fromTextArea(codeTextArea, {
            mode: 'text/x-csrc',  // Set the mode for C language
            lineNumbers: true,    // Enable line numbers
            theme: 'monokai'      // Set the theme to dracula
        });

        function c_to_shell(c_code) {
            stdoutArr = []
            let ModuleArgs = {
              'print': function(text) { stdoutArr.push(text); }, // Capture stdout
            };

            create_module(ModuleArgs).then((module) => {
              module.FS.writeFile("code.c", c_code); // write the C code to a file
              var compile = module.cwrap("compile", "void", ["string"])
              try {
                compile("code.c");
              } catch (e) {
                if (e instanceof module.ExitStatus && e.status == 0) {
                  console.log("Compilation successful");
                } else {
                  console.log("Failed to compile");
                }
              }
              document.getElementById('output').value = stdoutArr.join("\n");
            });
        }

        // Add event listener to the Compile button
        document.getElementById('compileButton').addEventListener('click', () => {
            // Get the code from the CodeMirror editor
            const code = codeEditor.getValue();
            // Compile the code using pnut-wasm
            c_to_shell(code);
        });

        // Add event listener to the Copy button
        document.getElementById('copyButton').addEventListener('click', () => {
            // Get the code from the CodeMirror editor
            const code = codeEditor.getValue();
            // Copy the code to the clipboard
            navigator.clipboard.writeText(code).then(() => {
                // Notify the user that the code has been copied
                alert('Code copied to clipboard');
            });
        });

        // Add event listener to the Copy button for the compiler output
        document.getElementById('copyButton2').addEventListener('click', () => {
            // Get the output from the compiler textarea
            const output = document.getElementById('output').value;
            // Copy the output to the clipboard
            navigator.clipboard.writeText(output).then(() => {
                // Notify the user that the output has been copied
                alert('Output copied to clipboard');
            });
        });

    });
});
