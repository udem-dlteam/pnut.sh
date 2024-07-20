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

    const codeTextArea = document.getElementById('code');
    const codeEditor = CodeMirror.fromTextArea(codeTextArea, {
        mode: 'text/x-csrc',
        lineNumbers: true,
        theme: 'monokai'
    });

    const outputTextArea = document.getElementById('output');
    const outputEditor = CodeMirror.fromTextArea(outputTextArea, {
        mode: 'shell',
        lineNumbers: true,
        theme: 'monokai',
        readOnly: true
    });

    // Function to load example code into the editor
    function loadExample(filename) {
        fetch("examples/" + filename).then(response => response.text()).then(text => {
            codeEditor.setValue(text);
        }).catch(error => {
            console.error('Error loading file:', error);
        });
    }

    // Load the initial example
    loadExample('sum.c');

    // On click of fileselect load the selected file
    document.getElementById('fileSelect').addEventListener('change', function() {
        const selectedFile = this.value;
        loadExample(selectedFile);
    });

    function c_to_shell(c_code) {
        stdoutArr = [];
        let ModuleArgs = {
          'print': function(text) { stdoutArr.push(text); },
        };

        create_module(ModuleArgs).then((module) => {
          module.FS.writeFile("code.c", c_code);
          var compile = module.cwrap("compile", "void", ["string"]);
          try {
            compile("code.c");
          } catch (e) {
            if (e instanceof module.ExitStatus && e.status == 0) {
              console.log("Compilation successful");
            } else {
              console.log("Failed to compile");
            }
          }
          outputEditor.setValue(stdoutArr.join("\n"));
        });
    }

    // Add event listener to the Compile button
    document.getElementById('compileButton').addEventListener('click', () => {
        const code = codeEditor.getValue();
        c_to_shell(code);
    });

    // Add event listener to the Copy button
    document.getElementById('copyButton').addEventListener('click', () => {
        const code = codeEditor.getValue();
        navigator.clipboard.writeText(code).then(() => {
            alert('Code copied to clipboard');
        });
    });

    // Add event listener to the Copy button for the compiler output
    document.getElementById('copyButton2').addEventListener('click', () => {
        const output = outputEditor.getValue();
        navigator.clipboard.writeText(output).then(() => {
            alert('Output copied to clipboard');
        });
    });
});
