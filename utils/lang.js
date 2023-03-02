export class LangKit {

    static assertTrue(v, message) {
        if (v) return v;
        throw new Error(message);
    }
}