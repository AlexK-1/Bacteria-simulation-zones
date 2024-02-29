# Bacteria simulation

Простая симуляция бактерий, управляемых *нейронной сетью* и живущих в однообразном виртуальном мире. 

## Основные объекты

В симуляции есть **бактерии**, выглядящие как цветные квадратики и три **зоны**, в которых отображаются данные, бактерии получают энергию или размножаются.

### Бактерии

Бактерии выглядят как квадратики, окрашенные в разные цвета. У бактерии есть *энергия* и возраст. С каждым тиком энергия бактерии уменьшается, а возраст увеличивается. Расход энергии не зависит от скорости передвижения. Бактерия погибает если у неё станет станет слишком мало энергии, или она "состарится". При рождении бактерия получает определённое количество энергии.

Цвет бактерии зависит от того, какой у неё предок (цвет передаётся по наследству), а яркость показывает количество энергии (чем светлее бактерия, тем больше у неё энергии). Цвет бактерии меняется при *мутации*.

Бактерия знает свой возраст, количество энергии, *позицию по x и y*. В *нейросети* бактерии всего 3 *слоя*. Она не видит другие бактерии и не может с ними взаимодействовать, **она может только передвигаться по оси x и y**. Вам может это показаться скучным, и что интересных результатов не будет, но даже с такими примитивными бактериями, появляются относительно умные и приспособленные бактерии с необычным поведением.

При рождении у бактерии есть небольшой шанс мутации. Если бактерия мутирует, она немного меняет свой цвет и меняются некоторые *веса* её нейросети. Мутация может быть удачной, что приводит к появлению нового ещё более приспособленного вида, или, что чаще всего происходит, неудачной, в результате чего бактерия погибает ~~от осознания своей никчёмности~~.

Бактерии не могут размножаться и получать энергию когда и где захотят. Для этого им нужно находиться в определённых зонах.

### Зоны

Всего существует три зоны: **жёлтая**, в которой бактерии получают энергию, **зелёная**, в которой бактерии размножаются, и **белая** для отображения данных симуляции (бактерии не могут в неё попасть).

Если бактерия находится в жёлтой зоне, она получает определённое количество энергии за каждый *тик*. По моей задумке бактерия должна прийти в эту зону для накопления энергии, чтобы в будущем дать большое потомство.

В зелёной зоне каждые несколько тиков бактерия создаёт новую бактерию с точно такими же мозгами и цветом (если не произойдёт мутация) как у неё, затрачивая на это определённое количество энергии.

В белую зону бактерии попасть не могут. Здесь отображаются такие данные как *FPS*, общее количество бактерий в симуляции и количество бактерий определённых видов. Это полезно для определения доминирующего вида и обнаружения бактерий-мутантов.

## О коде

Это мой первый проект, полностью написанный на JavaScript, поэтому не судите строго, ~~можете не говорить, что код плохой, т.к. я и сам это знаю~~.

Весь JavaScript код расположен в папке `scripts`.

В главном файле `script.js` создаётся основной класс игры и подключаются другие файлы. Здесь находится главный цикл, отображается симуляция, создаются бактерии.

Файл `inputHandler.js` содержит обработчик нажатия клавиши пробел для паузы.

В файле `zones.js` код всех зон.

Второй по важности файл `bacteria.js` содержит в себе код бактерий, он подключает и использует нейросеть для каждой бактерии, в нём происходят мутации.

Нейросеть я написал самостоятельно с нуля в файле `network.js`. В нём есть класс `Network`, который принимает в качестве параметра список слоёв. Класс `Layer` принимает параметры: количество входов слоя, количество нейронов в слое, *функция активации*, наличие *биаса*. У нейросети есть методы для обработки данных и мутации. По сути один объект слоя можно использовать как самостоятельную нейросеть без скрытых слоёв.

В файле `config.js` находятся константы для настройки симуляции.

## Настройка симуляции

Стандартные настройки предполагают необходимость бактериям перемещаться от жёлтой зоны к зелёной. То есть у бактерий будет относительно сложное поведение. Но если вы хотите поиграться с настройками и ~~заставить бактерий страдать~~ создать для бактерий свои условия, вам нужно изменить переменные в файле `config.js`. Я думаю, с этим справится даже тот, кто никогда не писал код на JavaScript ~~<sub>кабажабе привет</sub>~~.

Вот список переменных в файле `config.js` и их назначение:
* `NUM_BACTERIA` - количество бактерий, появляющихся при запуске
* `BACTERIA_SPEED` - скорость бактерий
* `MAX_AGE` - максимальный возраст бактерии, при котором она умирает от старости
* `REPR_COST` - сколько энергии тратит бактерия, когда отпочковывает новую бактерию
* `REPR_INTERVAL` - каждые сколько тиков бактерия размножается в зелёной зоне
* `REPR_START` - сколько тиков должна ждать бактерия, чтобы дать первый раз потомство
* `MUT_RATE` - шанс мутации бактерии от 0 до 1
* `MUT_SIZE` - шанс мутации одного веса нейросети мутировавшей бактерии от 0 до 1
* `GETTING_ENERGY` - сколько энергии бактерия получает в жёлтой зоне
* `MAX_ENERGY` - максимальное количество энергии, которое может иметь бактерия
* `ENERGY_BIRTH` - сколько энергии получает бактерия при рождении
* `ENERGY_USAGE` - сколько энергии бактерия теряет каждый тик
* `YELLOW_ZONE_X` - позиция по x жёлтой зоны (координаты 0 0 в левом верхнем углу)
* `YELLOW_ZONE_WIDTH` - ширина жёлтой зоны
* `YELLOW_ZONE_HEIGHT` - высота жёлтой зоны
* `GREEN_ZONE_X` - позиция по x зелёной зоны
* `GREEN_ZONE_WIDTH` - ширина зелёной зоны
* `GREEN_ZONE_HEIGHT` - высота зелёной зоны

Если вы хотите изменить структуру нейросети бактерий, измените строки с 42 по 46 в файле `bacteria.js`.

## Заключение
Это мой первый проект с симуляцией эволюции. Надеюсь, он вам понравится.

В скором времени я начну писать новую симуляцию бактерий, **ещё более интересную**!