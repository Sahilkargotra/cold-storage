import type { ComponentProps } from 'react';
import {
  Card as _Card,
  CardHeader as _CardHeader,
  CardFooter as _CardFooter,
  CardTitle as _CardTitle,
  CardDescription as _CardDescription,
  CardContent as _CardContent,
} from '@vrushabh-b/oneiot-ui';

export function Card(props: ComponentProps<typeof _Card>) { return <_Card {...props} />; }
export function CardHeader(props: ComponentProps<typeof _CardHeader>) { return <_CardHeader {...props} />; }
export function CardFooter(props: ComponentProps<typeof _CardFooter>) { return <_CardFooter {...props} />; }
export function CardTitle(props: ComponentProps<typeof _CardTitle>) { return <_CardTitle {...props} />; }
export function CardDescription(props: ComponentProps<typeof _CardDescription>) { return <_CardDescription {...props} />; }
export function CardContent(props: ComponentProps<typeof _CardContent>) { return <_CardContent {...props} />; }
