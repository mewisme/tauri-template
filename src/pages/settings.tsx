import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { VariantProps } from "class-variance-authority"
import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCursorStore } from "@/store/cursor"
import { useDebouncedCallback } from "@/hooks/use-debounce"
import { useSettingsStore } from "@/store/settings"

export function Settings() {
  const { autoCheckUpdate, updateCheckInterval, setState: setSettingsState } = useSettingsStore((s) => s)
  const {
    enableCursor,
    enableCursorFollow,
    cursorFollowSide,
    cursorFollowAlign,
    cursorFollowSideOffset,
    cursorFollowAlignOffset,
    cursorFollowContent,
    cursorFollowBadgeVariant,
    setState: setCursorState
  } = useCursorStore((s) => s)

  // Local state for debounced inputs
  const [updateCheckIntervalValue, setUpdateCheckIntervalValue] = useState(updateCheckInterval.toString())
  const [sideOffset, setSideOffset] = useState(cursorFollowSideOffset.toString())
  const [alignOffset, setAlignOffset] = useState(cursorFollowAlignOffset.toString())
  const [content, setContent] = useState(cursorFollowContent)

  // Debounced callbacks
  const debouncedSetUpdateCheckInterval = useDebouncedCallback((value: number) => {
    if (value < 5) {
      setUpdateCheckIntervalValue("5")
    }
    setSettingsState({ updateCheckInterval: value < 5 ? 5 : value })
  }, 500)

  const debouncedSetSideOffset = useDebouncedCallback((value: number) => {
    setCursorState({ cursorFollowSideOffset: value })
  }, 500)

  const debouncedSetAlignOffset = useDebouncedCallback((value: number) => {
    setCursorState({ cursorFollowAlignOffset: value })
  }, 500)

  const debouncedSetContent = useDebouncedCallback((value: string) => {
    setCursorState({ cursorFollowContent: value })
  }, 500)

  // Sync local state with store when it changes externally
  useEffect(() => {
    setUpdateCheckIntervalValue(updateCheckInterval.toString())
  }, [updateCheckInterval])

  useEffect(() => {
    setSideOffset(cursorFollowSideOffset.toString())
  }, [cursorFollowSideOffset])

  useEffect(() => {
    setAlignOffset(cursorFollowAlignOffset.toString())
  }, [cursorFollowAlignOffset])

  useEffect(() => {
    setContent(cursorFollowContent)
  }, [cursorFollowContent])

  return (
    <div className="flex justify-center w-full">
      <Card className="m-4 max-w-4xl w-full">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-between">
              <Label className={cn("text-sm font-normal", autoCheckUpdate ? "text-foreground" : "text-muted-foreground")}>Auto Check Update</Label>
              <Switch checked={autoCheckUpdate} onCheckedChange={(checked) => setSettingsState({ autoCheckUpdate: checked })} />
            </div>
            <div className="flex items-center gap-2 justify-between">
              <Label className={cn("text-sm font-normal text-foreground")}>Update Check Interval (every {updateCheckInterval} minutes)</Label>
              <Input
                className="w-30"
                type="number"
                min={5}
                value={updateCheckIntervalValue}
                onChange={(e) => {
                  const value = e.target.value
                  setUpdateCheckIntervalValue(value)
                  const numValue = parseInt(value)
                  if (!isNaN(numValue)) {
                    debouncedSetUpdateCheckInterval(numValue)
                  }
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center gap-2 justify-between">
              {/* Cursor */}
              <Label className={cn("text-sm font-normal", enableCursor ? "text-foreground" : "text-muted-foreground")}>Enable Cursor</Label>
              <Switch checked={enableCursor} onCheckedChange={(checked) => setCursorState({ enableCursor: checked })} />
            </div>
            <div className="flex items-center gap-2 justify-between">
              <Label className={cn("text-sm font-normal", enableCursorFollow ? "text-foreground" : "text-muted-foreground")}>Enable Cursor Follow</Label>
              <Switch checked={enableCursorFollow} onCheckedChange={(checked) => setCursorState({ enableCursorFollow: checked })} />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-between">
                <Label className={cn("text-sm font-normal text-foreground")}>Cursor Follow Side</Label>
                <Select value={cursorFollowSide} onValueChange={(value) => setCursorState({ cursorFollowSide: value as 'top' | 'bottom' | 'left' | 'right' })}>
                  <SelectTrigger size="sm" className="w-30">
                    <SelectValue placeholder={cursorFollowSide} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <Label className={cn("text-sm font-normal text-foreground")}>Cursor Follow Align</Label>
                <Select value={cursorFollowAlign} onValueChange={(value) => setCursorState({ cursorFollowAlign: value as 'start' | 'center' | 'end' })}>
                  <SelectTrigger size="sm" className="w-30">
                    <SelectValue placeholder={cursorFollowAlign} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <Label className={cn("text-sm font-normal text-foreground")}>Cursor Follow Side Offset</Label>
                <Input
                  className="w-30"
                  type="number"
                  value={sideOffset}
                  onChange={(e) => {
                    const value = e.target.value
                    setSideOffset(value)
                    const numValue = parseInt(value)
                    if (!isNaN(numValue)) {
                      debouncedSetSideOffset(numValue)
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <Label className={cn("text-sm font-normal text-foreground")}>Cursor Follow Align Offset</Label>
                <Input
                  className="w-30"
                  type="number"
                  value={alignOffset}
                  onChange={(e) => {
                    const value = e.target.value
                    setAlignOffset(value)
                    const numValue = parseInt(value)
                    if (!isNaN(numValue)) {
                      debouncedSetAlignOffset(numValue)
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <Label className={cn("text-sm font-normal text-foreground")}>Cursor Follow Content</Label>
                <Input
                  className="w-30"
                  value={content}
                  onChange={(e) => {
                    const value = e.target.value
                    setContent(value)
                    debouncedSetContent(value)
                  }} />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <Label className={cn("text-sm font-normal text-foreground")}>Cursor Follow Badge Variant</Label>
                <Select value={cursorFollowBadgeVariant as string} onValueChange={(value) => setCursorState({ cursorFollowBadgeVariant: value as 'default' | 'secondary' | 'destructive' | 'outline' })}>
                  <SelectTrigger size="sm" className="w-30">
                    <SelectValue placeholder={cursorFollowBadgeVariant} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
