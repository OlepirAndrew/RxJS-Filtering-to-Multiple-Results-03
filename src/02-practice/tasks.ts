import { addItem, run } from './../03-utils';
import {
    first,
    last,
    elementAt,
    min,
    max,
    find,
    findIndex,
    single,
    filter,
    sample,
    tap,
    sampleTime,
    map,
    audit,
    auditTime,
    throttle,
    throttleTime,
    debounce,
    debounceTime,
    skip,
    skipLast,
    skipUntil,
    skipWhile,
    take,
    pluck,
    takeLast,
    takeUntil,
    startWith,
    takeWhile,
    distinct,
    reduce,
    distinctUntilChanged,
    distinctUntilKeyChanged,
    switchMap,
    withLatestFrom,
    toArray, mergeMap, delay, concatMap
} from 'rxjs/operators';
import {EMPTY, from, fromEvent, fromEventPattern, generate, interval, of, pairs, pipe, range, timer} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {fromFetch} from "rxjs/fetch";

// Task 1. skip()
// Создайте поток из массива чисел от 1 до 10, используя range()
// Получите элементы потока начиная с 3.
(function task1(): void {
    const stream$ = range(1, 10).pipe(skip(3))

    // run(stream$);
})();

// Task 2. skipLast()
// Создайте поток из массива [1, 2, {}], используя from()
// Получите элементы потока без последнего элемента
(function task2(): void {
    const stream$ = from([1, 2, {}]).pipe(skipLast(1))

    // run(stream$);
})();


// Task 3. skipUntil()
// Создайте поток чисел, который выдает их каждую 1с, используя interval().
// Выведите эти числа серым цветом, использыя tap(), addItem(value, {color: '#ccc'})
// Создайте поток собития клик по кнопке runBtn
// Игнорируйте элементы первого потока до клика на кнопке
(function task3(): void {
    const event = fromEvent(document.querySelector('#runBtn'), 'click')
    const stream$ = interval(1000).pipe(
        tap(value => addItem(value, {color: '#ccc'})),
        skipUntil(event),
    )

    // run(stream$);
})();

// Task 4. skipWhile()
// Создайте поток чисел, который выдает их каждую 500мс, используя timer().
// Выведите эти числа серым цветом, использыя tap(), addItem(value, {color: '#ccc'})
// Игнорируйте элементы потока, пока они меньше 10, получите 5 элементов и завершите поток, используя take()
(function task4() {
    const stream$ = timer(0,500).pipe(
        tap(value => addItem(value, {color: '#ccc'})),
        skipWhile(value => value < 10),
        take(5)
    )

    // run(stream$);
})();


// Task 5. take()
// Создайте поток собития клик по кнопке runBtn, используя fromEvent()
// Получите метку времени трех кликов, используя pluck() и завершите поток.
(function task5() {
    const stream$ = fromEvent(document.querySelector('#runBtn'), 'click').pipe(
        take(3),
        pluck('timeStamp'),
        map(time => new Date(time))
    )

    // run(stream$);
})();

// Task 6. takeLast()
// Создайте поток из слов 'Ignore', 'Ignore', 'Hello', 'World!', используя of().
// Модифицируйте поток так, чтобы получить последние два слова в потоке.
// Соберите из них предложение, используя reduce()
(function task6() {
    const stream$ = of('Ignore', 'Ignore', 'Hello', 'World!').pipe(
        takeLast(2),
        toArray(),
        map(res => res.join(' '))
    )

    // run(stream$);
})();

// Task7. takeUntil()
// Создайте поток, который будет выполнять запрос каждую 1с в течении 5с, используя timer()
// и ajax(`https://api.github.com/users?per_page=5`); Время остановки должно формироваться с помощью потока,
// созданого с помощью timer()
// Добавьте в поток ответ запроса, используя pluck().
// Испльзуйте вспомагательный оператор switchMap()
(function task7() {
    const stream$ = timer( 0, 1000, ).pipe(
        take(5),
        switchMap(() => ajax(`https://api.github.com/users?per_page=5`)),
        pluck('response')
    )

    // run(stream$);
})();

// Task 8. takeWhile()
// Создайте поток случайных чисел в диапазоне от 0 до 1, используя Math.random, генератор, from()
// Добавьте в поток в качестве стартового значения 0.11, используя startWith()
// Получайте из потока числа пока они находятся в диапазоне от 0 до 0.7.
// Добавьте в поток также значение, которое нарушило условие.
(function task8() {
    function* generator(){
        while (true) {
            yield  Math.random();
        }
    }
      const stream$ = from(generator()).pipe(
          startWith(0.11),
          takeWhile(n => (n > 0 && n < 0.7), true)
      )

    // run(stream$);
})();

// Task 9. distinct()
// Создайте массив чисел с дублями, используя from().
// Модифицируйте поток так, чтобы в массиве были уникальные элементы
// Используйте reduce()
(function task9() {
    const arr = from([1,1,2,2,3,3,4,4,5,5,6,6,7,7])
    const stream$ = arr.pipe(
        distinct(),
        toArray()
    )

    // run(stream$);
})();

// Task 10. distinctUntilChanged()
// Реализуйте функцию, которая создает Observable, который будет выдавать в поток значения,
// хранящихся в свойстве sequence класса С, используя generate()
// Модифицируйте поток - уберите повторы в подряд идущих группах, соберите предложение,
// используя reduce()
(function task10() {
    class C<T> {
        private words: T[] = [];

        get size(): number {
            return this.words.length;
        }

        add(elem: T) {
            this.words.push(elem);
            return this;
        }

        get(index: number): T {
            return this.words[index];
        }
    }

    const obj = new C<string>()
                    .add('На')
                    .add('дворе')
                    .add('дворе')
                    .add('трава,')
                    .add('на')
                    .add('траве')
                    .add('траве')
                    .add('дрова.');


    const stream$ = timer(0,0).pipe(
        map(res => obj.get(res)),
        takeWhile(res => !!res),
        distinctUntilChanged(),
        toArray(),
        map(res => res.join(' '))

    )

    // run(stream$);
})();


// Task 11. distinctUntilKeyChanged()
// Пусть есть массив объектов. Создайте поток, в котором будут только три объекта, за исключением, второго объекта { name: 'Joe' }.
// Используйте from()
(function task11() {
    const ar = [
            { name: 'Brian' },
            { name: 'Joe' },
            { name: 'Joe' },
            { name: 'Sue' }
        ];

    const stream$ = from(ar).pipe(distinctUntilKeyChanged('name'))

    // run(stream$);
})();


// Task 12. filter()
// Пусть есть поток objAddressStream, который выдает объект и второй поток skipFieldsStream, который содержит перечень ключей объекта
// Необходимо модифицировать поток так, чтобы он выдавал объект без ключей из второго потока.
// Используйте switchMap, pairs, withLatestFrom, reduce
(function task12() {
    const skipFieldsStream$ = from(['build', 'flat']);
    const objAddressStream = of({
        country: 'Ukraine',
        city: 'Kyiv',
        index: '02130',
        street: 'Volodymyra Velikogo',
        build: 100,
        flat: 23
    });


    const stream$ = objAddressStream.pipe(
        switchMap(obj => pairs(obj)),
        withLatestFrom( skipFieldsStream$.pipe(toArray())),
        filter((value) => {
            const [values, fields] = value;
            return !fields.includes(values[0])
        }),
         map(res => res[0]),
         reduce((pre, cur) => {
            pre[cur[0]] = cur[1];
            return pre;
         }, {})
    );



    // run(stream$);
})();


// Task 13. sample()
// Создайте поток, который выдает числа каждую секунду, используя interval(). Выведите эти числа серым цветом,
// использыя tap(), addItem(value, {color: '#ccc'})
// Создайте поток событий 'click' на кнопке, используя fromEventPattern()
// Организуйте получение последнего элемента из первого
// потока во время клика по кнопке
(function task13() {
    const btn = document.getElementById('runBtn');
    
    const handler = handler => {
        btn.addEventListener('click', handler)
    };

    const removeHandler = handler => {
        btn.removeEventListener('click', handler)
    };
    //
    const stream$ = interval(1000).pipe(
        tap(value => addItem(value, {color: '#ccc'})),
        sample(
            fromEventPattern(handler, removeHandler),
        )

    )

    // run(stream$);
})();

// Task 14. sampleTime()
// Создайте поток, который выдает числа каждую секунду, используя interval(). Выводите эти числа серым цветом,
// использыя tap(), addItem(value, {color: '#ccc'})
// Модифицируйте данный поток так, чтобы он выдавал последнее число, которое было в потоке
// с периодом 3000мс
(function task14() {
    const stream$ = interval(1000).pipe(
        tap((value) => addItem(value, {color: '#ccc'})),
        sampleTime(3000)
    );

    // run(stream$);
})();


// Task 15. audit()
// Создайте поток, который выдает числа каждые 500мс, используя interval().
// Выводите эти числа серым цветом, использыя tap(), addItem(value, {color: '#ccc'})
// Создайте функцию, которая принимает число и возращает поток, который выдает числа каждую
// 1с, используя interval().
// Модифицируйте первый поток так, чтобы он выдавал значение только спустя время, заданое во
// втором потоке.
(function task15() {
    const stream$ = interval(500).pipe(
        tap(value => addItem(value, {color: '#ccc'})),
        audit(value => interval(1000)),
    )

    // run(stream$);
})();


// Task 16. auditTime()
// Создайте поток, который выдает числа каждую 1с, используя interval().
// Выводите эти числа серым цветом, использыя tap(), addItem(value, {color: '#ccc'})
// Модифицируйте первый поток так, чтобы он выдавал числи только спустя каждые 3с
(function task16() {
    const stream$ = interval(1000).pipe(
        tap((value) => addItem(value, {color: '#ccc'})),
        auditTime(3000)
    );

    // run(stream$);
})();


// Task 17. throttle()
// Создайте поток, который выдает числа каждую 1с, используя interval().
// Выводите эти числа серым цветом, использыя tap(), addItem(value, {color: '#ccc'})
// Модифицируйте первый поток так, чтобы он выдавал число, затем выдавал числа с периодом в число * 1000 мс.
(function task17() {
    const stream$ = interval(1000).pipe(
        tap((value) => addItem(value, {color: '#ccc'})),
        throttle(v => interval(v * 1000))
    );

    // run(stream$);
})();


// Task 18. throttleTime()
// Создайте поток объектов события mousemove?  Модифицируйте этот поток так, чтобы он выдал первое значение,
// а потом выдавал значение через каждый 2с
(function task18() {
    const stream$ = fromEvent(document, 'mousemove').pipe(
        throttleTime(2000)
    )

    // run(stream$, { outputMethod: 'console'});
})();

// Task 19. debounce()
// Создайте поток объектов события mousemove. Модифицируйте этот поток так, чтобы он выдал значение после того,
// как в потоке не будет появляться объект в течении времени заданого с помощью второго потока, например 500мс.
(function task19() {
    const stream$ = fromEvent(document, 'mousemove').pipe(
        debounce(() => interval(1000))
    )

    // run(stream$, { outputMethod: 'console'});
})();

// Task 20. debounceTime()
// Создайте поток значений поля ввода с id='text-field' для события keyup, используя fromEvent()
// Модифицируйте этот поток так, чтобы он выдавал значение поля ввода после того,
// как в потоке не будет появляться новое значение в течении 500мс.
(function task20() {
    const stream$ = fromEvent(document.querySelector('#text-field'), 'keyup').pipe(
        debounceTime(500),
        pluck('target', 'value'),
        distinctUntilChanged()
    )

    // run(stream$, { outputMethod: 'console'});
})();


export function runner() {}

// home work
// создать поток из тодо , делать емит каждые 500 млс
// каждые 3000 млс брать тудушку, делать запрос юзера по user id 
// добавить в обьект user обьект тодо


(function hw1() {
    interface  ITodo {
        "userId": number;
        "id": number;
        "title": string;
        "completed": boolean;
    }

    const btn = document.getElementById('runBtn');

    const stream$ = fromFetch('https://jsonplaceholder.typicode.com/todos').pipe(
        filter(response => response.ok),
        switchMap((response: Response) => response.json()),
        switchMap((todos: ITodo[]) => from(todos)),
        filter((todo: ITodo) => !todo.completed),
        concatMap((todo: ITodo) => of(todo).pipe(delay(500))),
        tap((todo: ITodo) => addItem(todo.userId, {color: '#ccc'})),
        auditTime(3000),
        switchMap((todo: ITodo) => ajax(`https://jsonplaceholder.typicode.com/users/${todo.userId}`).pipe(
            pluck('response'),
            map((user) => ({...user, todo: todo}))
        ))
    )

    // run(stream$);
    
})();
// взять превого юзера с  email доменом biz 
(function hw2() {
    const stream$ = ajax(`https://jsonplaceholder.typicode.com/users`).pipe(
        pluck('response'),
        concatMap(users => from(users)),
        distinctUntilChanged(user => user['email'].includes('biz')),
    )
    
    // run(stream$);
})();

(function hw3() {
    const period = 100;
    const source$ = interval(period);

    const notifyPeriod = 500;
    const notifier$ = interval(notifyPeriod);

    const stream$ = ajax(`https://jsonplaceholder.typicode.com/todos`).pipe(
        pluck('response'),
        mergeMap(todos => from(todos)),
        concatMap(todo => of(todo).pipe(delay(100))),
        sample(timer(0,3333)),
    )
    run(stream$);
})();

 
