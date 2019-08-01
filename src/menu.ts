import path from 'path';
import { app, Menu, shell, MenuItemConstructorOptions } from 'electron'; // eslint-disable-line
import {
  is,
  appMenu,
  aboutMenuItem,
  openUrlMenuItem,
  openNewGitHubIssue,
  debugInfo
} from 'electron-util';
import config from './config';

const showPreferences = () => {
  // Show the app's preferences here
};

const helpSubmenu: MenuItemConstructorOptions[] = [
  openUrlMenuItem({
    label: 'Website',
    url: 'https://github.com/xapphire13/undefined'
  }),
  openUrlMenuItem({
    label: 'Source Code',
    url: 'https://github.com/xapphire13/undefined'
  }),
  {
    label: 'Report an Issue…',
    click() {
      const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

      openNewGitHubIssue({
        user: 'xapphire13',
        repo: 'kondo',
        body
      });
    }
  }
];

if (!is.macos) {
  helpSubmenu.push(
    {
      type: 'separator'
    },
    aboutMenuItem({
      icon: path.join(__dirname, 'static', 'icon.png'),
      text: 'Created by '
    })
  );
}

const debugSubmenu: MenuItemConstructorOptions[] = [
  {
    label: 'Show Settings',
    click() {
      config.openInEditor();
    }
  },
  {
    label: 'Show App Data',
    click() {
      shell.openItem(app.getPath('userData'));
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Delete Settings',
    click() {
      config.clear();
      app.relaunch();
      app.quit();
    }
  },
  {
    label: 'Delete App Data',
    click() {
      shell.moveItemToTrash(app.getPath('userData'));
      app.relaunch();
      app.quit();
    }
  }
];

const macosTemplate: MenuItemConstructorOptions[] = [
  appMenu([
    {
      label: 'Preferences…',
      accelerator: 'Command+,',
      click() {
        showPreferences();
      }
    }
  ]),
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Custom'
      },
      {
        type: 'separator'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    role: 'viewMenu'
  },
  {
    role: 'windowMenu'
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
];

// Linux and Windows
const otherTemplate: MenuItemConstructorOptions[] = [
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Custom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Settings',
        accelerator: 'Control+,',
        click() {
          showPreferences();
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    role: 'viewMenu'
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
];

const template: MenuItemConstructorOptions[] =
  process.platform === 'darwin' ? macosTemplate : otherTemplate;

if (is.development) {
  template.push({
    label: 'Debug',
    submenu: debugSubmenu
  });
}

export default Menu.buildFromTemplate(template);
