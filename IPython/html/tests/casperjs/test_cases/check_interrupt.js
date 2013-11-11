//
// Test kernel interrupt 
//
casper.notebook_test(function () {
    this.evaluate(function () {
        var cell = IPython.notebook.get_cell(0);
        cell.set_text(
            'import time'+
            '\nfor x in range(3):'+
            '\n    time.sleep(1)'
            );
        cell.execute();
    });

    this.waitFor(function(){
        return this.evaluate(function() {
            return $("#notification_kernel")[0].textContent.indexOf('busy') !== -1;
        });
    });


    // interrupt using menu item (Kernel -> Interrupt)
    this.thenClick('li#int_kernel');

    this.wait_for_output(0);

    this.then(function () {
        var result = this.get_output_cell(0);
        this.test.assertEquals(result.ename, 'KeyboardInterrupt', 'keyboard interrupt (mouseclick)');
    });

    // run cell 0 again, now interrupting using keyboard shortcut
    this.thenEvaluate(function () {
        cell.clear_output();
        cell.execute();
    });

    // interrupt using Ctrl-M I keyboard shortcut
    this.thenEvaluate( function() {
        IPython.utils.press_ghetto(IPython.utils.keycodes.I)
    });
    
    this.wait_for_output(0);
    
    this.then(function () {
        var result = this.get_output_cell(0);
        this.test.assertEquals(result.ename, 'KeyboardInterrupt', 'keyboard interrupt (shortcut)');
    });
});
