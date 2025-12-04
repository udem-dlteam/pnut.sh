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

    // make both textareas larger
    codeEditor.setSize(null, 500);
    outputEditor.setSize(null, 500);

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

    function c_to_shell(compact, annotate, c_code) {
        stdoutArr = [];
        let ModuleArgs = {
          'print': function(text) { stdoutArr.push(text); },
        };

        let module_func;

        if (compact) {
            module_func = create_pnut_compact_module;
        } else {
            module_func = create_pnut_standard_module;
        }

        module_func(ModuleArgs).then((module) => {
          module.FS.writeFile("code.c", c_code);
          var compile = module.cwrap("compile", "void", ["number", "string"]);
          try {
            compile(annotate, "code.c");
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

    // Options modal functionality
    const optionsModal = document.getElementById('optionsModal');
    const closeModal = document.getElementById('closeModal');
    const saveOptions = document.getElementById('saveOptions');
    const resetOptions = document.getElementById('resetOptions');
    const compactCodeCheckbox = document.getElementById('compactCode');
    const annotateCodeCheckbox = document.getElementById('annotateCode');

    const default_options = {
        compactCode: false,
        annotateCode: false,
    };

    // Load saved options from localStorage
    function loadBoolOption(key, defaultValue) {
        const value = localStorage.getItem(key);
        if (value === null) {
            return defaultValue;
        } else {
            return (value == 'true');
        }
    }

    function loadOptions() {
        compactCodeCheckbox.checked = loadBoolOption('compactCode', true);
        annotateCodeCheckbox.checked = loadBoolOption('annotateCode', true);
    }

    // Save options to localStorage
    function saveOptionsToStorage() {
        localStorage.setItem('compactCode', compactCodeCheckbox.checked);
        localStorage.setItem('annotateCode', annotateCodeCheckbox.checked);
    }

    // Reset options to defaults
    function resetOptionsToDefaults() {
        compactCodeCheckbox.checked = default_options.compactCode;
        annotateCodeCheckbox.checked = default_options.annotateCode;
        saveOptionsToStorage();
    }

    // Show modal
    function showModal() {
        optionsModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Hide modal
    function hideModal() {
        saveOptionsToStorage();
        optionsModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }

    // Options modal event handlers
    document.getElementById('optionsButton').addEventListener('click', () => { showModal(); });
    closeModal.addEventListener('click', () => { hideModal(); });
    resetOptions.addEventListener('click', () => { resetOptionsToDefaults(); });
    saveOptions.addEventListener('click', () => { hideModal(); });

    // Close modal when clicking outside of it
    optionsModal.addEventListener('click', (e) => {
        if (e.target === optionsModal) hideModal();
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && optionsModal.style.display === 'block') hideModal();
    });

    // Load options on page load
    loadOptions();

    // Add event listener to the Compile button
    document.getElementById('compileButton').addEventListener('click', () => {
        const code = codeEditor.getValue();
        const compact = document.getElementById('compactCode').checked;
        const annotate = document.getElementById('annotateCode').checked;
        c_to_shell(compact, annotate, code);
    });

    // Add event listener to the Copy button
    document.getElementById('copyButtonC').addEventListener('click', () => {
        const code = codeEditor.getValue();
        navigator.clipboard.writeText(code);
    });

    // Add event listener to the Copy button for the compiler output
    document.getElementById('copyButtonShell').addEventListener('click', () => {
        const output = outputEditor.getValue();
        navigator.clipboard.writeText(output);
    });
});
