import type { ComponentProps } from 'react';
import {
  Tabs as _Tabs,
  TabsList as _TabsList,
  TabsTrigger as _TabsTrigger,
  TabsContent as _TabsContent,
} from '@vrushabh-b/oneiot-ui';

export function Tabs(props: ComponentProps<typeof _Tabs>) { return <_Tabs {...props} />; }
export function TabsList(props: ComponentProps<typeof _TabsList>) { return <_TabsList {...props} />; }
export function TabsTrigger(props: ComponentProps<typeof _TabsTrigger>) { return <_TabsTrigger {...props} />; }
export function TabsContent(props: ComponentProps<typeof _TabsContent>) { return <_TabsContent {...props} />; }
