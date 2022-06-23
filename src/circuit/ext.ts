import type { Extension } from "../../core/ext/Extension";

import Dynamic from "./dynamic";
import Stateful from "./stateful";
import Stateless from "./stateless";

export const name = "circuit";

export default function main(ext: Extension<{}>) {
    ext.api().expose("Stateless", Stateless);
    ext.api().expose("Stateful", Stateful);
    ext.api().expose("Dynamic", Dynamic);
}