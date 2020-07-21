//const path = require('path')
import * as fs from 'fs'
import { IHash } from '../interfaces'

const file_str_cache: IHash = {}

export function load_file(path: string): string {

    file_str_cache[path] = fs.readFileSync(path).toString()

    return file_str_cache[path]

}

export function load_cached_file(path: string): string {

    if(file_str_cache[path] == undefined) file_str_cache[path] = fs.readFileSync(path).toString()

    return file_str_cache[path]

}