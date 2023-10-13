import detectChardet from "./chardet.js"
import translateDeepl from "./deepl.js"
import detectFasttext from "./fasttext-lid.js"
import detectFranc from "./franc.js"
import detectSocialHub from "./socialhub.js"

export type ServiceNames = Partial<typeof services[number]["name"]>
export type ServiceFns = typeof services[number]["fn"]
export type ServiceValues = Awaited<ReturnType<ServiceFns>>

export const services = [
  { name: 'chardet', fn: detectChardet },
  /**
   * Refuses to work on render. Update: think I was instanciating the class each time, memory issues.
   * Oct 4 08:00:29 PM  Illegal instruction (core dumped)
   * Oct 4 08:00:29 PM  error Command failed with exit code 132.
   * Oct 4 08:00:29 PM  info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
   */
  { name: 'fasttext', fn: detectFasttext },
  { name: 'franc', fn: detectFranc },
  { name: 'deepl', fn: translateDeepl },
  { name: 'socialhub', fn: detectSocialHub },
]
