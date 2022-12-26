mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

extern crate num;

fn dot_sub<T>(a: &Vec<Vec<T>>, b: &Vec<Vec<T>>) -> Option<Vec<Vec<T>>>
where
    T: num::Num + Clone + Copy,
{
    if a.len() == 0 || a[0].len() != b.len() {
        return None;
    }

    let mut res = vec![vec![T::zero(); a.len()]; b[0].len()];
    for i in 0..a.len() {
        for k in 0..a[0].len() {
            for j in 0..b[0].len() {
                res[i][j] = res[i][j] + a[i][k] * b[k][j];
            }
        }
    }
    Some(res)
}

const MAX: usize = 1024;

#[wasm_bindgen]
pub struct Matrix {
    result: [f64; MAX],
}

#[wasm_bindgen]
impl Matrix {
    pub fn new() -> Matrix {
        Matrix { result: [0.0; MAX] }
    }

    pub fn get_result_ptr(&self) -> *const f64 {
        self.result.as_ptr()
    }

    pub fn dot(&mut self, a: JsValue, b: JsValue, di: u8, dk: u8, dj: u8) {
        utils::set_panic_hook();
        let (di, dk, dj) = (di as usize, dk as usize, dj as usize);
        let a: Vec<f64> = a.into_serde().unwrap();
        let b: Vec<f64> = b.into_serde().unwrap();

        let a = (0..di)
            .map(|i| (0..dk).map(|k| a[i * dk + k]).collect::<Vec<_>>())
            .collect::<Vec<_>>();

        let b = (0..dk)
            .map(|k| (0..dj).map(|j| b[k * dj + j]).collect::<Vec<_>>())
            .collect::<Vec<_>>();

        dot_sub(&a, &b)
            .unwrap()
            .iter()
            .flatten()
            .enumerate()
            .for_each(|(i, &v)| self.result[i] = v);
    }
}
