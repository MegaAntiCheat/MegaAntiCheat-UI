import React from "react";
import "./SideMenu.css";

import { Divider, Flex, SideMenuItem } from "..";
import {
  ArrowDownToLine,
  ChevronRightSquare,
  ListTodo,
  Menu,
  Settings2,
  X,
} from "lucide-react";

const SideMenu = () => {
  const [collapsed, setCollapsed] = React.useState(true);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuIcon = (
    <a
      className={`sidemenu-icon ${collapsed ? "collapsed" : ""}`}
      href="https://megascatterbomb.com/mcd"
      target="_blank"
    >
      <img
        width={32}
        height={32}
        style={{ borderRadius: "10px" }}
        src="https://cdn.discordapp.com/icons/1112665618869661726/d6a0255dfca479cbde6707908fbc9a2a.webp"
      />
    </a>
  );

  const MenuHeader = () => {
    return (
      <span className="sidemenu-header">
        {collapsed && menuIcon}
        <div className="sidemenu-header-flex">
          {!collapsed && menuIcon}
          {!collapsed && (
            <span className={`sidemenu-title ${collapsed ? "collapsed" : ""}`}>
              MCD
            </span>
          )}
          <span
            className={`sidemenu-toggle ${collapsed ? "collapsed" : ""}`}
            onClick={handleToggleCollapse}
          >
            {collapsed ? (
              <Menu width={32} height={32} />
            ) : (
              <X width={32} height={32} />
            )}
          </span>
        </div>
      </span>
    );
  };

  return (
    <div className={`sidemenu-outer ${collapsed ? "collapsed" : ""}`}>
      <MenuHeader />
      <div>
        <Divider size={2} />
        <SideMenuItem
          title="Options"
          Icon={<Settings2 />}
          collapsed={collapsed}
        />
        <SideMenuItem
          title="Player History"
          Icon={<ListTodo />}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default SideMenu;
