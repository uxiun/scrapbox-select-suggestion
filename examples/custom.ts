import { setup, SetupInit } from "../mod.tsx";
import { addTextInputEventListener } from "../deps/scrapbox.ts";

export const launch = async (init?: SetupInit) => {
	const mysetup: SetupInit = {
		...init,
		limit: 20,
		enableSelfProjectOnStart: true,
		projects: [
			"miuna",
			// "wnhangul",

			"villagebump",
			"1cc",
			"noratetsu",
			"mrsekut-p",
			"blu3mo-public",
		]
	}
	const ops = await setup(mysetup);

	addTextInputEventListener("keydown", (e) => {
		if (e.metaKey || e.altKey) return;

		switch (e.key) {
			case "Down": {
				if (e.ctrlKey) return;
				if (e.altKey) return;
				const executed = e.shiftKey
				? ops.selectPrev?.({ cyclic: true })
				: ops.selectNext?.({ cyclic: true });
				if (!executed) return;
				break;
			}
			case "Enter": {
				if (e.shiftKey) return;
				if (e.ctrlKey && ops.selectNext?.({ cyclic: true })) return

				if (e.altKey) return;
				if (!ops.confirm?.()) return;
				break;
			}
			case "j": {
				if (e.shiftKey) return;
				if (!e.ctrlKey) return;
				if (e.altKey) return
				if (ops.selectNext?.({ cyclic: true })) return
			}
			case "k": {
				if (e.shiftKey) return;
				if (!e.ctrlKey) return;
				if (e.altKey) return
				if (ops.selectPrev?.({ cyclic: true })) return
			}

			case "i": {
				if (e.shiftKey) return;
				if (!e.ctrlKey) return;
				if (e.altKey) return;
				if (!ops.confirm?.({ icon: true })) return;
				break;
			}
			case "Escape": {
				if (e.shiftKey) return;
				if (e.ctrlKey) return;
				if (e.altKey) return;
				if (!ops.cancel?.()) return;
				break;
			}
			default:
			return;
		}
		e.preventDefault();
		e.stopPropagation();
	});
};
