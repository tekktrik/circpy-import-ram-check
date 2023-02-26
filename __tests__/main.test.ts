/* eslint-disable no-console */

import * as path from 'path'
import * as cp from 'child_process'
import * as process from 'process'
import {test, expect} from '@jest/globals'
import * as fs from 'fs'

const testif = function (cond: boolean) {
  if (cond) {
    return test
  }
  console.log(
    'Test being skipped, use `npm run create-files` to create UF2 and filesystem files.'
  )
  return test.skip
}

const FIRMWARE_EXISTS = fs.existsSync('firmware.uf2')
const imgfor = function (name: string): string {
  return 'fat12_' + name + '.img'
}
const exists = function (name: string): boolean {
  return fs.existsSync(imgfor(name))
}

testif(FIRMWARE_EXISTS && exists('pass'))('Test runs', function () {
  process.env['INPUT_FIRMWARE'] = 'firmware.uf2'
  process.env['INPUT_FILESYSTEM'] = imgfor('pass')
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

testif(FIRMWARE_EXISTS && exists('timeout'))(
  'Test fails after 60 seconds',
  function () {
    process.env['INPUT_FIRMWARE'] = 'firmware.uf2'
    process.env['INPUT_FILESYSTEM'] = imgfor('timeout')
    const np = process.execPath
    const ip = path.join(__dirname, '..', 'lib', 'main.js')
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    }
    const start = new Date()
    try {
      cp.execFileSync(np, [ip], options).toString()
    } catch (error) {}
    const end = new Date()
    const delta = Math.abs(end.getTime() - start.getTime())
    const maxDiff = 1.5 * 60 * 1000
    expect(delta).toBeLessThanOrEqual(maxDiff)
  }
)
