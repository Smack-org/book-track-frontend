import { config } from "@vue/test-utils"
import RouterLinkStub from "../tests/stubs/RouterLinkStub"

config.global.stubs = {
    RouterLink: RouterLinkStub,
}
