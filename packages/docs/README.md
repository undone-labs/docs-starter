## The Docs Directory

Theme directory should contain the following 3 top-level files, even if unused:

- `theme.scss`
- `typography.scss`
- `utilities.scss`

This is an overview of how to apply custom theming/styling to the Docs Starter
after forking and setting up a new Docs site. The Docs Starter comes with
Undone Labs Docs ('zero') styling applied 'out of the box', however, any and all
styles site wide can be disabled, changed, added or customized. All custom
styles will sit on top of and override existing, 'zero' and core styles.

To begin, note the three .scss files located in the 'default' directory
adjacent to this README file; 'theme.scss', 'typography.scss' and
'utilities.scss'. These three files are imported last in the scss import
declarations and thus will take priorty over all preceding css styling.
These files contain commented-out variable declarations that will override
existing variables and styles. Most variables will be self explanatory,
otherwise there will be further comments describing what effect changing any
variable will have. You can uncomment-out variables in these files or add
more styles directly to them as needed. However, it is encouraged to copy the
entire 'default' directory, rename it according to your theme and place it at
the same level in the directory structure (a direct descendant of the 'themes'
package). With this newly named directory you can enable the styles within it by
editting the following key in `/packages/src/nuxt.config.js` with the folder
name:

```
overrideTheming: {
  themeName: '<your-theme-name>'
}
```

There is no limit to how many separate theme folders can be added to the
`/themes` package and the Nuxt config override key above allows you to easily
toggle between different themes. If the name of the desired theme folder is not
specified in the config, the 'default' theme will be used.

See the three aforementioned .scss files in the `/default` theme directory for
more information on what variables are available to edit. Any additional
styling can be added in this folder or your custom theme folder in separate
.scss files or subdirectories and imported into the folder's `theme.scss` file.
